import connectToDatabase from '@/mongoose/mongodbUser';
import User from '@/model/usersModel';

import corsMiddleware from '@/utilis/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
    await connectToDatabase();
    const { customerId } = req.query;

    if (req.method === 'POST') {
        const { name, quantity, price } = req.body;

        if (!name || !quantity || !price) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            await connectToDatabase();

            const newOrder = {
                name,
                quantity,
                price,
                status: 'Pending',
            };

            const updatedUser = await User.findOneAndUpdate(
                { _id: customerId },
                { $push: { orders: newOrder } },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(201).json({ message: 'Order added successfully', order: newOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
})
};
