import Queue from '../models/Queue.js';

export const getQueues = async (req, res) => {
  try {
    const queues = await Queue.find();
    res.json(queues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinQueue = async (req, res) => {
  try {
    const { serviceId, userId, name } = req.body;
    
    const existing = await Queue.findOne({ userId, status: { $in: ['Waiting', 'Serving'] } });
    if (existing) return res.status(400).json({ error: 'Already in a queue' });

    const serviceQueueCount = await Queue.countDocuments({ serviceId });
    const tokenStr = `T-${serviceQueueCount + 10}`;
    
    const newEntry = await Queue.create({
      serviceId, userId, token: tokenStr, name: name || 'User', status: 'Waiting', priority: false
    });
    
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const walkInQueue = async (req, res) => {
  try {
    const { serviceId, name, priority } = req.body;
    const serviceQueueCount = await Queue.countDocuments({ serviceId });
    const tokenStr = `W-${serviceQueueCount + 10}`;
    
    const newEntry = new Queue({
      serviceId, token: tokenStr, name: name || 'Walk-in', status: 'Waiting', priority: !!priority
    });
    
    // In MongoDB, ordering is usually by createdAt. If priority is true, we could adjust timestamp to be older,
    // or just rely on sorting logic on the frontend/backend.
    // Let's set createdAt to slightly older if priority is true to put them at the front of the waiting line.
    if (newEntry.priority) {
      // Find oldest waiting user
      const oldestWaiting = await Queue.findOne({ serviceId, status: 'Waiting' }).sort({ createdAt: 1 });
      if (oldestWaiting) {
        newEntry.createdAt = new Date(oldestWaiting.createdAt.getTime() - 1000); // 1 sec older
      }
    }
    
    await newEntry.save();
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const callNext = async (req, res) => {
  try {
    const { serviceId } = req.body;
    
    await Queue.updateMany({ serviceId, status: 'Serving' }, { status: 'Completed' });
    
    const nextInLine = await Queue.findOne({ serviceId, status: 'Waiting' }).sort({ createdAt: 1 });
    if (nextInLine) {
      nextInLine.status = 'Serving';
      await nextInLine.save();
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const queue = await Queue.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { id } = req.body;
    const queue = await Queue.findByIdAndUpdate(id, { status: 'Checked-in' }, { new: true });
    res.json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejoinQueue = async (req, res) => {
  try {
    const { id } = req.body;
    const queue = await Queue.findById(id);
    if (!queue || queue.status !== 'Missed') return res.status(400).json({ error: 'Cannot rejoin' });
    
    // Reinsert logic: Place them as waiting, set createdAt to Date.now() to put them at end of current waiting
    queue.status = 'Waiting';
    queue.createdAt = new Date();
    await queue.save();
    
    res.json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
