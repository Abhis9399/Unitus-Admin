import mongoose from 'mongoose';
import Enquiry from '@/model/enquiryModel';
import Item from '@/model/item'; // Adjust the import path as per your project structure


export default async function handler(req,res){
  const { customerId } = req.query;
  
  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const enquiries = await Enquiry.find({ userId: customerId })
      .populate({
        path: 'item',
        select: 'name', // Select the 'itemName' field from the 'item' collection
        model: Item // Model reference for 'item' collection
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Fetched enquiries for customerId ${customerId}:`, enquiries);

    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await mongoose.disconnect();
  }
}
