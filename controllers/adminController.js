import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import Queue from '../models/Queue.js';

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.json(admin || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ adminId: req.params.adminId });
    const enriched = await Promise.all(services.map(async (s) => {
      const waiting = await Queue.countDocuments({ serviceId: s._id, status: 'Waiting' });
      return { ...s.toJSON(), waiting, type: req.user.type }; 
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { adminId, name, location, avgTime } = req.body;
    // ensure adminId belongs to logged in admin
    if (adminId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    const newService = await Service.create({ adminId, name, location, avgTime: Number(avgTime) || 10 });
    res.json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    if (service.adminId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await Service.findByIdAndDelete(serviceId);
    await Queue.deleteMany({ serviceId }); 
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
