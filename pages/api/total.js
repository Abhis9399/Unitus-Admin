import dbConnect from '@/mongoose/mongodbUser';
import Customer from '@/model/customer';
import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await dbConnect();
  try {
    const totalCustomers = await Customer.countDocuments();
    res.status(200).json({ totalCustomers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total customers' });
  }
});
}

