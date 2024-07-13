import connectToDatabase from '@/mongoose/mongodbUser';
import users from '@/model/usersModel';

export default async function handler(req,res){
  await connectToDatabase();

  const { customerId } = req.query;

  try {
    const user = await users.findById(customerId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ enquiries: user.enquiries || [] });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
