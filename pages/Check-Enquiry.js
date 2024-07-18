import React, { useState } from 'react';
import mongoose from 'mongoose';
import CustomerEnquiries from '@/components/CustomerEnquiries'; // Adjust the import path as needed
import users from '@/model/usersModel'; // Ensure this path is correct for your model

const Customers = ({ customers }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const handleCustomerSelect = (e) => {
    setSelectedCustomerId(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md shadow-blue-900 rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Customer Enquiries</h1>
          <div className="mb-4">
            <label htmlFor="customer-select" className="block text-lg font-medium text-gray-700">
              Select Customer:
            </label>
            <select
              id="customer-select"
              onChange={handleCustomerSelect}
              value={selectedCustomerId}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCustomerId && <CustomerEnquiries customerId={selectedCustomerId} />}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    await mongoose.connect(process.env.MONGODB_URL_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const customers = await users.find({}).lean();

    return {
      props: {
        customers: JSON.parse(JSON.stringify(customers)),
      },
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      props: {
        customers: [],
      },
    };
  }
}

export default Customers;
