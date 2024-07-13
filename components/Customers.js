import React, { useState } from 'react';
import mongoose from 'mongoose';
import CustomerEnquiries from '@/components/CustomerEnquiries'; // Adjust the import as needed
import users from '@/model/usersModel';

const Customers = ({ customers }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const handleCustomerSelect = (e) => {
    setSelectedCustomerId(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div>
            <label htmlFor="customer-select" className="block text-lg font-medium text-gray-700">
              Select Customer:
            </label>
            <select
              id="customer-select"
              onChange={handleCustomerSelect}
              value={selectedCustomerId}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
}

export default Customers;