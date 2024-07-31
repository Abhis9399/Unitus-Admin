import mongoose from 'mongoose';
import Order from '@/model/order'; // Ensure the path is correct

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { customerId } = req.query;

    try {
      const orders = await Order.find({ customer: customerId }).lean();
      res.status(200).json({ orders: JSON.parse(JSON.stringify(orders)) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
