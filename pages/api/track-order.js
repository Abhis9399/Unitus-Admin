import Shipday from 'shipday/integration';
import corsMiddleware from '@/utilis/cors';
import { OrderInfoRequest, OrderItem, PaymentMethod, CardType } from 'shipday/integration';

import {connectToDatabase} from '@/mongoose/mongodbUser'; // Your db connection logic
import Order from '@/model/order';

// Initialize the Shipday client with your API key
const shipdayClient = new Shipday(process.env.NEXT_PUBLIC_SHIPDAY, 10000);

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      const { orderId } = req.query;

      try {
        // Connect to your MongoDB database
        await connectToDatabase();

        // Fetch the order from the database to get the Shipday hash ID
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        // Fetch tracking data from Shipday using the Shipday SDK
        const trackingData = await fetchTrackingFromShipday(order.shipdayHashId);

        res.status(200).json(trackingData);
      } catch (error) {
        console.error('Error fetching tracking data:', error.message);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}

async function fetchTrackingFromShipday(hashId) {
  try {
    // Replace this with the correct API call to fetch the tracking data for the order
    const trackingData = await shipdayClient.tracking.getTrackingDetails(hashId); // Adjust this method as per Shipday's API documentation
    
    return trackingData;
  } catch (error) {
    console.error('Error in fetchTrackingFromShipday:', error.message);
    throw error;
  }
}
