import User from '../models/User.js';
import Service from '../models/Service.js';
import Queue from '../models/Queue.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('adminId');
    const enriched = await Promise.all(services.map(async (s) => {
      const waiting = await Queue.countDocuments({ serviceId: s._id, status: 'Waiting' });
      const adminType = s.adminId ? s.adminId.type : 'Hospital';
      const businessName = s.adminId ? s.adminId.businessName : 'Unknown Business';
      return { ...s.toJSON(), adminId: s.adminId ? s.adminId._id : null, waiting, type: adminType, businessName };
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
