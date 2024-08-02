import twilio from 'twilio';
import mongoose from 'mongoose';
import Supplier from '@/model/supplier';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URL_USER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Fetch suppliers
      const suppliers = await Supplier.find({});
      const message = "Good morning! Please enter today's price and vehicle availability in the format: Price:XX, Capacity:YY, Material:ZZ. Reply to this message.";

      // Send notifications
      const notificationPromises = suppliers.map(supplier =>
        client.messages.create({
          from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
          to: `whatsapp:${supplier.contact}`,
          body: message
        })
        .then(message => console.log(`Message sent to ${supplier.contact}`))
        .catch(err => console.error(err))
      );

      await Promise.all(notificationPromises);

      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Error sending notifications' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
