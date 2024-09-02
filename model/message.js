import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);

