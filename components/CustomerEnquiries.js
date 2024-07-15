import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerEnquiries = ({ customerId }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [totalPrice, setTotalPrice] = useState('');
  const [isDealDone, setIsDealDone] = useState(false);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(`/api/enquiries?customerId=${customerId}`);
        setEnquiries(response.data);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    fetchEnquiries();
  }, [customerId]);

  const handleConvertToOrder = async (enquiryId) => {
    try {
      const response = await axios.post('/api/orders/create', {
        enquiryId,
        totalPrice,
        isDealDone,
      });
      console.log('Order created:', response.data);
  
      // Now delete the enquiry from the database
     
  
      // Remove the converted enquiry from the state
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter((enquiry) => enquiry._id !== enquiryId)
      );

      await axios.delete(`/api/enquiries/${enquiryId}`);
  
      // Reset selected enquiry and form fields
      setSelectedEnquiry(null);
      setTotalPrice('');
      setIsDealDone(false);
    } catch (error) {
      console.error('Error converting enquiry to order:', error);
    }
  };
  

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Customer Enquiries</h2>
      <ul>
        {enquiries.map((enquiry) => (
          <li key={enquiry._id} className="mb-2 p-2 border rounded-md">
            <p><strong>Item:</strong> {enquiry.item.name}</p>
            <p><strong>Sub Products:</strong></p>
            <ul>
              {enquiry.subProducts.map((subProduct, index) => (
                <li key={index}>
                  <p>{subProduct.name}, Quantity: {subProduct.quantity}, Size: {subProduct.size}, Unit: {subProduct.unit}, Brand: {subProduct.brandName}</p>
                </li>
              ))}
            </ul>
            <p><strong>Date:</strong> {new Date(enquiry.createdAt).toLocaleDateString()}</p>
            <p><strong>Deadline:</strong> {enquiry.deadline ? new Date(enquiry.deadline).toLocaleDateString() : 'Not specified'}</p>
            <p><strong>Frequency:</strong> {enquiry.frequency}</p>
            <p><strong>Certificates:</strong> {enquiry.certificates}</p>
            <p><strong>Payment Terms:</strong> {enquiry.paymentTerms}</p>
            <p><strong>Site Address:</strong> {enquiry.siteAddress}</p>
            <button className="block w-full p-2 bg-green-500 text-white rounded-md shadow-sm" onClick={() => setSelectedEnquiry(enquiry._id)}>Add Price</button>
          </li>
        ))}
      </ul>

      {selectedEnquiry && (
        <div className="mt-4 p-4 border rounded-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConvertToOrder(selectedEnquiry);
            }}
          >
            <div className="mb-4">
              <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
              <input
                type="number"
                id="totalPrice"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="isDealDone" className="block text-sm font-medium text-gray-700">Is Deal Done?</label>
              <input
                type="checkbox"
                id="isDealDone"
                checked={isDealDone}
                onChange={(e) => setIsDealDone(e.target.checked)}
                className="mt-1 block p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="block w-full p-2 bg-green-500 text-white rounded-md shadow-sm"
            >
              Convert to Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerEnquiries;
