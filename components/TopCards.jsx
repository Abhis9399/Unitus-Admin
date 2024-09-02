import React, { useEffect, useState } from 'react';

const TopCards = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersRes = await fetch('/api/orders/total');
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.totalOrders);

        const revenueRes = await fetch('/api/revenue/total');
        const revenueData = await revenueRes.json();
        setTotalRevenue(revenueData.totalRevenue);

        const customersRes = await fetch('/api/total');
        const customersData = await customersRes.json();
        setTotalCustomers(customersData.totalCustomers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  
  return (
    <div className="grid lg:grid-cols-3 gap-6 p-6">
      <div className="bg-white shadow-md shadow-blue-900 rounded-lg p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-gray-900">{totalOrders ? totalOrders.toLocaleString() : 0}</p>
          <p className="text-gray-600">Total No of Orders</p>
        </div>
        {/* <div className="bg-green-100 text-green-700 p-3 rounded-full">
          <span className="text-lg">+18%</span>
        </div> */}
      </div>
      <div className="bg-white shadow-md shadow-blue-900 rounded-lg p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue ? totalRevenue : 0}</p>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        {/* <div className="bg-green-100 text-green-700 p-3 rounded-full">
          <span className="text-lg">+12%</span>
        </div> */}
      </div>
      <div className="bg-white shadow-md shadow-blue-900 rounded-lg p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-gray-900">{totalCustomers?totalCustomers.toLocaleString():0}</p>
          <p className="text-gray-600">Customers</p>
        </div>
        {/* <div className="bg-green-100 text-green-700 p-3 rounded-full">
          <span className="text-lg">+26%</span>
        </div> */}
      </div>
    </div>
  );
};

export default TopCards;

