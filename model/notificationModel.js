import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  minPrice: { type: Number },
  maxCapacity: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
