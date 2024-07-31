import mongoose from 'mongoose';
import Supplier from '@/model/supplier';
import Notification from '@/model/notificationModel';

const handler = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const suppliers = await Supplier.find({});
    if (suppliers.length === 0) return res.status(404).send('No suppliers found');

    const minPrice = Math.min(...suppliers.map(s => s.dailyPrice));
    const maxCapacity = Math.max(...suppliers.map(s => s.dailyCapacity));

    const notification = new Notification({
      minPrice,
      maxCapacity
    });

    await notification.save();

    // Notify buyers (implement notification system for buyers here)
    // Example: use Twilio or email service to notify buyers

    res.status(200).json({ minPrice, maxCapacity });
  } catch (error) {
    console.error('Error processing supplier data:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default handler;
