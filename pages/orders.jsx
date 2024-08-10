import React, { useState } from 'react';
import Order from '@/model/order';
import mongoose from 'mongoose';

const OrdersPage = ({ initialOrders }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleExpandOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-4 md:p-8">
      <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-6">Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => handleExpandOrder(order._id)}
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h3>
              <p className="text-gray-600">Customer ID: {order.customer}</p>
              <p className="text-gray-600">Total Amount: ₹{order.finalAmount}</p>
            </div>
            {expandedOrderId === order._id && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-md font-semibold mb-2">Full Details</h4>
                <div className="mb-2">
                  <strong>Sub-Products:</strong>
                  {order.subProducts.map((sp, index) => (
                    <div key={index} className="ml-2">
                      <div className="font-medium text-sm">Name: <span className="font-normal">{sp.name}</span></div>
                      <div className="font-medium text-sm">Quantity: <span className="font-normal">{sp.quantity}</span></div>
                      <div className="font-medium text-sm">Brand: <span className="font-normal">{sp.brandName}</span></div>
                    </div>
                  ))}
                </div>
                <div className="mb-2">
                  <strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <strong>Payment Method:</strong> {order.paymentTerms}
                </div>
                <div className="mb-2">
                  <strong>Site Address:</strong> {order.siteAddress}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const orders = await Order.find({}).lean();

  return {
    props: {
      initialOrders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default OrdersPage;
