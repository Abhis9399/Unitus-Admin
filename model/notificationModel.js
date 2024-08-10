import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  minPrice: {  type: SchemaTypes.Double, },
  maxCapacity: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
