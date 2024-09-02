import Order from '@/model/order';
import { connectToDatabase } from '@/mongoose/mongodbUser';
import corsMiddleware from '@/utilis/cors';

export default async function handler(req, res) {
  await corsMiddleware(req, res, async () => {
    try {
      await connectToDatabase();
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$finalAmount" } } }
      ]);

      // Convert Decimal128 to string, then parse to float and format to two decimal places
      const totalRevenueFormatted = totalRevenue.length > 0 
        ? parseFloat(totalRevenue[0].total.toString()).toFixed(2) 
        : '0.00';

      res.status(200).json({ totalRevenue: totalRevenueFormatted });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching total revenue' });
    }
  });
}
