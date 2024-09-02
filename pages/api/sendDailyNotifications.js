import mongoose from 'mongoose';
import Supplier from '@/model/supplier';  // Assuming you have a supplier model
import Message from '@/model/message';  // Assuming you have a message model

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

    // Iterate over each supplier
    await Promise.all(suppliers.map(async (supplier) => {
      // Delete previous messages for the supplier
      await Message.deleteMany({ supplierId: supplier._id });

      const currentDate = new Date().toLocaleDateString();  // Formats the date as mm/dd/yyyy
      const messageContent = `Good morning! ${supplier.representativeName}, please enter today's (${currentDate}) price, vehicle availability, and material supply in the format: Price:XX, Capacity:YY, Material:ZZ.`;
      
      // Create and save the new message
      const message = new Message({
        supplierId: supplier._id,
        content: messageContent,
        timestamp: new Date(),
        status: 'unread'  // Assuming you have a status field to mark messages as unread
      });

      await message.save();
    }));

    res.status(200).json({ message: 'Messages saved to dashboards successfully!' });
  } catch (error) {
    console.error('Error saving messages:', error);
    res.status(500).json({ error: 'Error saving messages' });
  } finally {
    await mongoose.disconnect();
  }
};

export default handler;
