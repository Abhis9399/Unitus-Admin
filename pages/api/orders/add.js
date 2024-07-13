import dbConnect from '@/mongoose/mongodbUser';
import Order from '@/model/order';
import Customer from '@/model/customer';
import corsMiddleware from '@/utils/cors'; // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const { customerId, totalPrice, items } = req.body;

      // Ensure customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const newOrder = new Order({
        customer: customerId,
        totalPrice,
        items,
      });

      await newOrder.save();

      res.status(201).json({ message: 'Order added successfully', order: newOrder });
    } catch (error) {
      res.status(500).json({ error: 'Error adding order' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
})
}

