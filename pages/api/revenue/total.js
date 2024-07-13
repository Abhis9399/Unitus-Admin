
import Order from '@/model/order';
import connectDb from '@/mongoose/mongodbUser';
import corsMiddleware from '@/utilis/cors'// Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await connectDb();
  
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.status(200).json({ totalRevenue: totalRevenue[0].total });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total revenue' });
  }
})
}

