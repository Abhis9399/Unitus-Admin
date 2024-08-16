import React, { useState } from 'react';
import Order from '@/model/order';
import User from '@/model/usersModel';  // Adjust the path as necessary
import { OrderInfoRequest, OrderItem, PaymentMethod, CardType } from 'shipday/integration';
import mongoose from 'mongoose';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrdersPage = ({ initialOrders }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState({});

  const handleExpandOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleTrackOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/track-order?orderId=${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      const data = await response.json();
      console.log('Tracking Data:', data); // Log tracking data for debugging
      setTrackingData((prev) => ({ ...prev, [orderId]: data })); // Update tracking data for the specific order
    } catch (error) {
      console.error('Error fetching tracking data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insert-order?orderId=${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) {
        throw new Error('Failed to insert order into Shipday');
      }
      const data = await response.json();
      console.log('Order inserted into Shipday:', data); // Log response for debugging
      
      // Show success toast
      toast.success('Order successfully inserted into Shipday!');
    } catch (error) {
      console.error('Error inserting order into Shipday:', error.message);
      // Show error toast
      toast.error('Failed to insert order into Shipday.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-4 md:p-8">
      <ToastContainer />
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
              <button
                onClick={() => handleTrackOrder(order._id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
              <button
                onClick={() => handleInsertOrder(order._id)}
                className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? 'Inserting...' : 'Insert Order into Shipday'}
              </button>
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
                {trackingData[order._id] && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Tracking Information:</h4>
                    <pre className="bg-gray-200 p-2 rounded">{JSON.stringify(trackingData[order._id], null, 2)}</pre>
                  </div>
                )}
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
