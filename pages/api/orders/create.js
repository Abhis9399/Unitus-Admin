// pages/api/orders/create.js

import mongoose from 'mongoose';
import Order from '@/model/order';
import Enquiry from '@/model/enquiryModel';
import User from '@/model/usersModel';

export default async function handler(req,res){
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { enquiryId, totalPrice, isDealDone } = req.body;

  if (!enquiryId || !totalPrice) {
    return res.status(400).json({ error: 'Enquiry ID and total price are required' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const order = new Order({
      enquiryId: enquiry._id,
      customer: enquiry.userId,
      item: enquiry.item,
      subProducts: enquiry.subProducts,
      deadline: enquiry.deadline,
      frequency: enquiry.frequency,
      siteAddress: enquiry.siteAddress,
      certificates: enquiry.certificates,
      paymentTerms: enquiry.paymentTerms,
      totalPrice: totalPrice,
      isDealDone: isDealDone,
      createdAt: Date.now(),
    });

    await order.save();

    // Update user's orders
    await User.findByIdAndUpdate(enquiry.userId, {
      $push: { orders: { enquiryId: enquiry._id, price: totalPrice, date: order.createdAt } },
    });

    res.status(200).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error converting enquiry to order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await mongoose.disconnect();
  }
}
