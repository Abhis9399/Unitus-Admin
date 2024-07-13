import dbConnect from '@/mongoose/mongodbUser';
import Customer from '@/model/customer';

export default async function handler(req,res){
  await dbConnect();
  try {
    const totalCustomers = await Customer.countDocuments();
    res.status(200).json({ totalCustomers });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total customers' });
  }
}

