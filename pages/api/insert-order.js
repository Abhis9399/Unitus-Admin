import shipday from "shipday/integration";
import OrderInfoRequest from "shipday/integration/order/request/order.info.request";
import OrderItem from "shipday/integration/order/request/order.item";
import Order from '@/model/order';  // Adjust the path as needed

const shipdayClient = new shipday(process.env.NEXT_PUBLIC_SHIPDAY, 55800);
export default async function handler(req, res) {
    const { orderId } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log(`Fetching order with ID: ${orderId}`);
        // Fetch the order from MongoDB
        const order = await Order.findById(orderId).populate('customer supplierId item');

        if (!order) {
            console.log(`Order with ID ${orderId} not found`);
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.shipdayInserted) {
            console.log(`Order with ID ${orderId} has already been inserted into Shipday`);
            return res.status(400).json({ error: 'Order already inserted into Shipday' });
        }

        const orderInfoRequest = new OrderInfoRequest(
            order._id.toString(),
            `${order.customer.name}`,  // Assuming customer schema has firstName and lastName
            order.siteAddress,  // Assuming this is the delivery address
            order.customer.email,  // Assuming customer schema has email
            order.customer.phone,  // Assuming customer schema has phoneNumber
            order.supplierId.companyName,  // Assuming supplier schema has companyName
            order.supplierId.address  // Assuming supplier schema has companyAddress
        );

        orderInfoRequest.setRestaurantPhoneNumber(order.supplierId.contact); // Assuming supplier schema has contactNumber
        orderInfoRequest.setExpectedDeliveryDate(order.deadline.toISOString().split('T')[0]); // Setting expected delivery date

        const itemsArr = order.subProducts.map(subProduct => {
            const unitPrice = parseFloat(order.price);
            const quantity = parseInt(subProduct.quantity, 10);
          
            if (isNaN(unitPrice) || isNaN(quantity)) {
              console.error('Invalid unit price or quantity:', { unitPrice, quantity });
            }
          
            return new OrderItem(
              `${subProduct.name} (${subProduct.brandName})`,
              unitPrice,
              quantity
            );
          });

        orderInfoRequest.setOrderItems(itemsArr);
        orderInfoRequest.setTotalOrderCost(parseFloat(order.totalPrice));

        console.log('Sending order to Shipday API');
        const response = await shipdayClient.orderService.insertOrder(orderInfoRequest);
        console.log('Shipday API response:', response);

        if (response.success) {
            // Mark the order as inserted
            await Order.findByIdAndUpdate(orderId, { shipdayInserted: true });
        }

        res.status(200).json(response);
      
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: error.message });
    }
}
