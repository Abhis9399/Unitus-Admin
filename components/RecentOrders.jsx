import React, { useState, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import axios from 'axios';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">No recent orders.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center">Error fetching orders: {error}</p>;
  }

  const getBadgeClass = (isDealDone) => {
    return isDealDone ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getBadgeText = (isDealDone) => {
    return isDealDone ? 'Deal Done' : 'Deal Pending';
  };

  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-6 border rounded-lg bg-white overflow-scroll shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Recent Orders</h1>
      <ul>
        {orders.map((order) => (
          <li
            key={order._id}
            className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-4 flex items-center justify-between cursor-pointer shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <FaShoppingBag className="text-purple-800" />
              </div>
              <div className="pl-4">
                {order.subProducts.map((sp, index) => (
                  <div key={index}>
                    <div className="font-medium text-gray-700">
                      <span className="font-normal">{sp.name}</span> (<span className="font-normal">{sp.brandName}</span>)
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getBadgeClass(order.isDealDone)}`}>
              {getBadgeText(order.isDealDone)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrders;
