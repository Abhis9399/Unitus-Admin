import mongoose from 'mongoose';
import Supplier from '@/model/supplier';
import { parseMessage } from '@/utilis/messageParser';
import bodyParser from 'body-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  bodyParser.urlencoded({ extended: true })(req, res, async () => {
    try {
      const { Body, From } = req.body;

      if (!Body || !From) {
        return res.status(400).json({ error: 'Invalid request format' });
      }

      console.log('Received message:', Body, 'from:', From);

      await mongoose.connect(process.env.MONGODB_URL_USER);
      console.log('Connected to MongoDB');

      const parsedData = parseMessage(Body);
      console.log('Parsed Data:', parsedData);

      // Remove the "whatsapp:" prefix from the From field
      const contactNumber = From.replace('whatsapp:', '');

      const supplier = await Supplier.findOne({ contact: contactNumber });
      if (!supplier) {
        console.log('Supplier not found for contact:', contactNumber);
        return res.status(404).json({ error: 'Supplier not found' });
      }

      supplier.dailyPrice = parsedData.price;
      supplier.dailyCapacity = parsedData.capacity;
      supplier.material = parsedData.material;

      await supplier.save();
      console.log('Supplier data updated successfully');

      res.status(200).json({ message: 'Data received and stored successfully!' });
    } catch (error) {
      console.error('Error processing response:', error);
      res.status(500).json({ error: 'Error processing response', details: error.message });
    } finally {
      mongoose.connection.close();
    }
  });
};

export default handler;
