import dbConnect from '@/mongoose/mongodbUser';
import Order from '@/model/order';
import corsMiddleware from '@/utilis/cors' // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await dbConnect();
    try{
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total orders' });
  }
})
}

