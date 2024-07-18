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
      // <div className="min-w-screen min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 px-5 py-5 w-full overflow-hidden">
      <>
      <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-6">Orders</h2>
      <div className="bg-gray-50 min-h-screen p-4">
      <div className="overflow-y-auto">
        <table className="min-w-full bg-white rounded-xl shadow-xl shadow-blue-900 overflow-y-auto">
          <thead className="bg-gradient-to-r from-blue-300 to-blue-900 text-gray-800">
            <tr>
            <th className="py-2 md:py-4 px-2 md:px-6 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
            Order ID
              </th>
              <th className="py-2 md:py-4 px-2 md:px-6 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
              Customer ID
              </th>
              <th className="py-2 md:py-4 px-2 md:px-6 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
              Sub-Products
              </th>
              <th className="py-2 md:py-4 px-2 md:px-6 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
              Total Price
              </th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                {/* Main Row */}
                <tr
                  className="hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => handleExpandOrder(order._id)}
                >
                  <td className="py-2 md:py-4 px-2 md:px-6 border-b border-gray-300">{order._id}</td>
                  <td className="py-2 md:py-4 px-2 md:px-6 border-b border-gray-300">{order.customer}</td>
                  <td className="py-2 md:py-4 px-2 md:px-6 border-b border-gray-300">
                    {order.subProducts.map((sp, index) => (
                      <div key={index} className="mb-1 md:mb-2">
                        <div className="font-medium text-xs md:text-sm">
                          Name: <span className="font-normal">{sp.name}</span>
                        </div>
                      </div>
                    ))}
                  </td>

                  <td className="py-2 md:py-4 px-2 md:px-6 border-b border-gray-300">{order.totalPrice}</td>
                
                </tr>
                {/* Expanded Row */}
                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan="4" className="py-2 md:py-4 px-2 md:px-6 border-b border-blue-900">
                      <div className="bg-gradient-to-r from-blue-300 to-blue-900 p-2 md:p-4 rounded-md">
                        <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">Full Details</h3>
                        <div className="mb-1 md:mb-2">
                          <strong>Sub-Products:</strong>
                          {order.subProducts.map((sp, index) => (
                            <div key={index} className="ml-2">
                              {/* <div className="font-medium text-xs md:text-sm">
                                Name:{' '}
                                <span className="font-normal">{sp.name}</span>
                              </div> */}
                              <div className="font-medium text-xs md:text-sm">
                                Quantity:{' '}
                                <span className="font-normal">{sp.quantity}</span>
                              </div>
                              <div className="font-medium text-xs md:text-sm">
                                Brand:{' '}
                                <span className="font-normal">{sp.brandName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mb-1 md:mb-2">
                          <strong>Deadline:</strong>{' '}
                          {new Date(order.deadline).toLocaleDateString()}
                        </div>
                        <div className="mb-1 md:mb-2">
                        <strong>Payment Method:</strong>{' '}
                        {order.paymentTerms}
                        </div>
                        <div className="mb-1 md:mb-2">
                        <strong>Site Address:</strong>{' '}
                        {order.siteAddress}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
    // </div>
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
