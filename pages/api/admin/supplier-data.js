import mongoose from 'mongoose';
import Supplier from '@/model/supplier';
import Message from '@/model/message';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch all suppliers
    const suppliers = await Supplier.find({});

    if (suppliers.length === 0) {
      return res.status(404).json({ error: 'No suppliers found' });
    }

    // Fetch messages and compute best rates and availability
    const supplierData = await Promise.all(suppliers.map(async (supplier) => {
      const messages = await Message.find({ supplierId: supplier._id }).sort({ timestamp: -1 });
      const latestMessage = messages[0];  // Assuming the latest message is the first one after sorting
      return {
        ...supplier.toObject(),
        latestMessage: latestMessage ? latestMessage.content : 'No messages',
      };
    }));

    // Compute best rate and best availability
    const bestRate = supplierData.reduce((best, supplier) => {
      return (!best || supplier.dailyPrice < best.dailyPrice) ? supplier : best;
    }, null);

    const bestAvailability = supplierData.reduce((best, supplier) => {
      return (!best || supplier.dailyCapacity > best.dailyCapacity) ? supplier : best;
    }, null);

    // Handle case when no best rate or availability is found
    const bestRateMessage = bestRate
      ? `Supplier with the best rate is ${bestRate.representativeName} with a price of ${bestRate.dailyPrice}.`
      : 'No rate data available.';
    
    const bestAvailabilityMessage = bestAvailability
      ? `Supplier with the best availability is ${bestAvailability.representativeName} with a capacity of ${bestAvailability.dailyCapacity}.`
      : 'No availability data available.';

    res.status(200).json({
      suppliers: supplierData,
      bestRate: {
        supplier: bestRate,
        message: bestRateMessage,
      },
      bestAvailability: {
        supplier: bestAvailability,
        message: bestAvailabilityMessage,
      },
    });
  } catch (error) {
    console.error('Error fetching supplier data:', error);
    res.status(500).json({ error: 'Failed to fetch supplier data' });
  } finally {
    await mongoose.disconnect();
  }
};

export default handler;
