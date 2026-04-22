import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  type: { type: String, required: true, enum: ['Hospital', 'Bank', 'Government', 'Retail', 'Restaurant'] },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Admin', adminSchema);
