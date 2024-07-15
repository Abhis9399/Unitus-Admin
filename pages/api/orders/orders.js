// pages/api/orders/index.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Order from '@/model/order';
import connectToDatabase from '@/mongoose/mongodbUser';
export default async function handler(req,res){
  await connectToDatabase();
 
  try {
    if (req.method === 'GET') {
      await mongoose.connect(process.env.MONGODB_URL_USER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      res.status(200).json(orders);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
