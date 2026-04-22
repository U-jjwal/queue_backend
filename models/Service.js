import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  avgTime: { type: Number, default: 10 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Service', serviceSchema);
