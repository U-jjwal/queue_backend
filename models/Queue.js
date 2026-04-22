import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for Walk-ins
  token: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['Waiting', 'Checked-in', 'Serving', 'Completed', 'Missed'], default: 'Waiting' },
  priority: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Queue', queueSchema);
