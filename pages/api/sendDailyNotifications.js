import twilio from 'twilio';
import mongoose from 'mongoose';
import Supplier from '@/model/supplier';  // Assuming you have a supplier model

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const suppliers = await Supplier.find({});
    const message = "Good morning! Please enter today's price, vehicle availability, and material supply in the format: Price:XX, Capacity:YY, Material:ZZ. Reply to this message.";

    await Promise.all(suppliers.map(supplier => 
      client.messages.create({
        from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
        to: `whatsapp:${supplier.contact}`,
        body: message
      })
    ));

    res.status(200).json({ message: 'Notifications sent successfully!' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Error sending notifications' });
  } finally {
    mongoose.connection.close();
  }
};

export default handler;
