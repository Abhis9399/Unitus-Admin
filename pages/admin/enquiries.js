// pages/admin/enquiries.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import mongoose from 'mongoose';
import Enquiry from '@/model/enquiryModel';

const AdminEnquiries = ({ initialEnquiries }) => {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const router = useRouter();

  useEffect(() => {
    setEnquiries(initialEnquiries);
  }, [initialEnquiries]);

  const handleEnquiryDetails = (enquiryId) => {
    router.push(`/admin/enquiries/${enquiryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Enquiries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Item</th>
              <th className="py-2 px-4 border">Sub-Products</th>
              <th className="py-2 px-4 border">Deadline</th>
              <th className="py-2 px-4 border">Frequency</th>
              <th className="py-2 px-4 border">Site Address</th>
              <th className="py-2 px-4 border">Created At</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td className="py-2 px-4 border">{enquiry.item.name}</td>
                <td className="py-2 px-4 border">
                  {enquiry.subProducts.map((sp, index) => (
                    <div key={index}>
                      <div>Name: {sp.name}</div>
                      <div>Quantity: {sp.quantity}</div>
                      <div>Brand: {sp.brandName}</div>
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border">{new Date(enquiry.deadline).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{enquiry.frequency}</td>
                <td className="py-2 px-4 border">{enquiry.siteAddress}</td>
                <td className="py-2 px-4 border">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">
                  <button onClick={() => handleEnquiryDetails(enquiry._id)} className="bg-purple-500 text-white p-2 rounded">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await mongoose.connect(process.env.MONGODB_URL_USER);

  let enquiries = [];
  try {
    enquiries = await Enquiry.find({}).populate('item').lean();
  } catch (error) {
    console.error("Failed to fetch enquiries:", error);
  }

  return {
    props: { initialEnquiries: JSON.parse(JSON.stringify(enquiries)) },
  };
}

export default AdminEnquiries;
