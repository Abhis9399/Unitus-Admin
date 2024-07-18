import React, { useState } from "react";
import { useRouter } from "next/router";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import mongoose from "mongoose";
import users from '@/model/usersModel';

const CustomersPage = ({ initialCustomers }) => {
  const [customers, setCustomers] = useState(initialCustomers || []);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const router = useRouter();

  const navigateToAddCustomer = () => {
    router.push("/Check-Enquiry");
  };

  const toggleOrders = (customerId) => {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(customerId);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between p-4">
        <h2 >Customers</h2>
        <button
          onClick={navigateToAddCustomer}
          className="bg-blue-900 p-2 rounded text-white"
        >
          Check Enquiry
        </button>
      </div>
      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
            <span>Name</span>
            <span className="sm:text-left text-right">Email</span>
            <span className="hidden sm:grid">Phone</span>
          </div>
          <ul>
            {customers.map((customer) => (
              <li
                key={customer._id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid 
                            md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div onClick={() => toggleOrders(customer._id)} className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-blue-900" />
                  </div>
                  <p  className="pl-4">{customer.name}</p>
                </div>
                <p className="text-gray-600 sm:text-left text-right">{customer.email}</p>
                <p className="hidden sm:flex">{customer.phone}</p>
       
                {selectedCustomer === customer._id && (
                  <div className="col-span-4 bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Orders</h3>
                    {customer.orders.length > 0 ? (
                      <ul>
                        {customer.orders.map((order, index) => (
                          <li key={index} className="mb-2">
                            <p><strong>Order Id:</strong> {order._id}</p>
                            <p><strong>Customer Id:</strong> {order.customer}</p>
                            <p><strong>Price:</strong> {order.totalPrice}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No orders found for this customer.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Server-side rendering or static generation to provide initial data
export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const customers = await users.find({}).lean();
  
  return {
    props: {
      initialCustomers: JSON.parse(JSON.stringify(customers)),
    },
  };
}

export default CustomersPage;
