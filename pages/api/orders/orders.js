import connectToDatabase from '@/mongoose/mongodbUser';
import User from '@/model/usersModel';
import Order from '@/model/order';
import corsMiddleware from '@/utils/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await connectToDatabase();
  const { enquiryId, price, customerId } = req.body;

  try {
    await connectToDatabase();

    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newOrder = {
      enquiryId,
      price,
      date: new Date(),
    };

    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: 'Order generated successfully', order: newOrder });
  } catch (error) {
    console.error('Error generating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
};
