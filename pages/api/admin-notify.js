import twilio from 'twilio';
import mongoose from 'mongoose';
import Notification from '@/model/notificationModel';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const notification = await Notification.findOne().sort({ timestamp: -1 });

    if (!notification) return res.status(404).send('No notification found');

    const message = `Today's minimum price is ${notification.minPrice} and maximum vehicle capacity is ${notification.maxCapacity}.`;

    // Send notification to admin
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
      to: `whatsapp:7000951267`, // Replace with actual admin number
      body: message
    });

    res.status(200).send('Admin notified');
  } catch (error) {
    console.error('Error notifying admin:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default handler;
