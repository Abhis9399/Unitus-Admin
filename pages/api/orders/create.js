import mongoose from 'mongoose';
import Order from '@/model/order';
import Enquiry from '@/model/enquiryModel';
import User from '@/model/usersModel';
import corsMiddleware from '@/utilis/cors';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Use existing database connection
    return;
  }
  // Use new database connection
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { enquiryId, totalPrice, isDealDone } = req.body;

    if (!enquiryId || !totalPrice) {
      return res.status(400).json({ success: false, error: 'Enquiry ID and total price are required' });
    }

    try {
      await connectDB();

      const enquiry = await Enquiry.findById(enquiryId);
      if (!enquiry) {
        return res.status(404).json({ success: false, error: 'Enquiry not found' });
      }

      const requirement = enquiry.requirements[0];
      if (!requirement || !requirement.supplierId || !requirement.price) {
        return res.status(400).json({ success: false, error: 'Supplier ID or price not found in the enquiry requirements' });
      }

      const supplierId = requirement.supplierId;
      const price = requirement.price;

      // Calculate FinalPrice based on subProducts
      let finalAmount = 0;
      enquiry.subProducts.forEach(subProduct => {
        finalAmount += (price * 1.18) * subProduct.quantity;
      });

      const order = new Order({
        enquiryId: enquiry._id,
        customer: enquiry.userId,
        supplierId,
        price,
        item: enquiry.item,
        subProducts: enquiry.subProducts,
        deadline: enquiry.deadline,
        frequency: enquiry.frequency,
        siteAddress: enquiry.siteAddress,
        certificates: enquiry.certificates,
        paymentTerms: enquiry.paymentTerms,
        totalPrice,
        isDealDone,
        finalAmount, // Ensure this matches your schema
        createdAt: Date.now(),
      });

      await order.save();

      // Update user's orders
      await User.findByIdAndUpdate(enquiry.userId, {
        $push: { orders: { enquiryId: enquiry._id, price: totalPrice, date: order.createdAt } },
      });

      res.status(200).json({ success: true, message: 'Order created successfully', order });
    } catch (error) {
      console.error('Error converting enquiry to order:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
}
