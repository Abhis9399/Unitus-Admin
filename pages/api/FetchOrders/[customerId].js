import mongoose from 'mongoose';
import orders from '@/model/order'; // Import the order model
import items from '@/model/item'; // Import the item model
import suppliers from '@/model/supplier'; // Import the supplier model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customerId } = req.query;


  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Fetch orders for the customer
    const customerOrders = await orders.find({ customer: customerId }).lean();

    // Fetch item names, supplier names, and enrich subproducts details
    const enrichedOrders = await Promise.all(
      customerOrders.map(async (order) => {
        const item = await items.findById(order.item).lean();
        const supplier = await suppliers.findById(order.supplierId).lean();
        
        return {
          ...order,
          itemName: item ? item.name : 'Unknown Item',
          supplierName: supplier ? supplier.name : 'Unknown Supplier',
          subproducts: order.subproducts.map(subproduct => ({
            name: subproduct.name,
            quantity: subproduct.quantity,
          })),
        };
      })
    );

    res.status(200).json({ orders: enrichedOrders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
