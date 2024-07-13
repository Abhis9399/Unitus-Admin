// pages/api/customers.js
import connectMongo from '@/mongoose/mongodbUser';
import customers from '@/model/usersModel';
import corsMiddleware from '@/utilis/cors' // Make sure the path is correct

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
  await connectMongo();
    try {
      const Customers = await customers.find({});
      console.log('Fetched customers:', Customers); // Add this line
      res.status(200).json(Customers);
    } catch (error) {
      console.error('Error fetching customers:', error); // Add this line
      res.status(500).json({ error: 'Error fetching customers' });
    }
  })
  }
