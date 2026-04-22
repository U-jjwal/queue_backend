import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { JWT_SECRET } from '../middlewares/authMiddleware.js';

const sendTokenResponse = (res, statusCode, userOrAdmin, role, token) => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  if (role === 'admin') {
    res.status(statusCode).cookie('token', token, options).json({ message: 'Success', admin: userOrAdmin, token });
  } else {
    res.status(statusCode).cookie('token', token, options).json({ message: 'Success', user: userOrAdmin, token });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, location, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email exists' });

    const user = await User.create({ name, email, phone, location, password });
    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET);

    sendTokenResponse(res, 200, user, 'user', token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET);
    sendTokenResponse(res, 200, user, 'user', token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { businessName, type, location, email, phone, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email exists' });

    const admin = await Admin.create({ businessName, type, location, email, phone, password });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET);
    
    sendTokenResponse(res, 200, admin, 'admin', token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET);
    sendTokenResponse(res, 200, admin, 'admin', token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id);
      return res.json({ role: 'admin', user: admin });
    } else {
      const user = await User.findById(req.user.id);
      return res.json({ role: 'user', user });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
