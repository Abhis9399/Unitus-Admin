import React, { useState } from "react";
import { useRouter } from "next/router";
import { BsPersonFill } from "react-icons/bs";
import { connectToDatabase } from "@/mongoose/mongodbUser"; // Assuming you have a db connection utility
import Customer from "@/model/usersModel"; // Import your Customer model
import Order from "@/model/order"; // Import your Order model
import mongoose from "mongoose";

const CustomersPage = ({ initialCustomers }) => {
  const [customers, setCustomers] = useState(initialCustomers || []);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const router = useRouter();

  const navigateToAddCustomer = () => {
    router.push("/Check-Enquiry");
  };

  const fetchOrders = async (customerId) => {
    const response = await fetch(`/api/FetchOrders/${customerId}`);
    const data = await response.json();
    setOrderDetails(data.orders);
    setSelectedCustomer(customerId);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={navigateToAddCustomer}
          className="bg-blue-900 p-2 rounded text-white"
        >
          Check Enquiry
        </button>
      </div>
      <div className="w-full m-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
          >
            <div className="flex items-center mb-2">
              <BsPersonFill className="text-blue-900 mr-2 text-3xl" />
              <h3 className="text-lg font-semibold">{customer.name}</h3>
            </div>
            <p className="mb-1"><strong>Email:</strong> {customer.email}</p>
            <p className="mb-1"><strong>Phone:</strong> {customer.phone}</p>
            <p className="mb-1"><strong>Revenue:</strong> ₹{parseFloat(customer.revenue).toFixed(2)}</p>
            <button
              // onClick={() => fetchOrders(customer._id)}
              className="bg-blue-600 text-white p-2 rounded mt-auto"
            >
              View All Orders
            </button>
          </div>
        ))}
      </div>
      {selectedCustomer && (
        <div className="p-4 mt-4 bg-white border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Orders for {selectedCustomer}</h3>
          {orderDetails.length > 0 ? (
            <ul>
              {orderDetails.map((order) => (
                <li key={order._id} className="mb-2">
                  <p><strong>Order Id:</strong> {order._id}</p>
                  <p><strong>Item Id:</strong> {order.item}</p>
                  <p><strong>Final Amount:</strong> ₹{parseFloat(order.finalAmount).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found for this customer.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Server-side rendering to fetch initial customer data
export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const customers = await Customer.find({}).lean();

  for (let customer of customers) {
    const orders = await Order.find({ customer: customer._id }).lean();

    let totalRevenue = 0; // Start with a number 0

    for (let order of orders) {
      if (order.finalAmount) {
        // Convert Decimal128 to string and then parse it as a number for addition
        const orderAmount = parseFloat(order.finalAmount.toString());
        totalRevenue += orderAmount;
      }
      else {
        console.log(`Order ID: ${order._id} has no finalAmount field.`);
      }
    }

    customer.revenue = totalRevenue.toFixed(2);
  }

  return {
    props: {
      initialCustomers: JSON.parse(JSON.stringify(customers)),
    },
  };
}


export default CustomersPage;