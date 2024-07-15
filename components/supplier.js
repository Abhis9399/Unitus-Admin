import React from 'react';
import Image from 'next/image';

const SupplierModal = ({ supplier, onClose }) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md md:max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">{supplier.companyName}</h2>
        <p><strong>Representative Name:</strong> {supplier.representativeName}</p>
        <p><strong>Contact Number:</strong> {supplier.contact}</p>
        <p><strong>Address:</strong> {supplier.address}</p>
        <p><strong>City:</strong> {supplier.city}</p>
        <p><strong>State:</strong> {supplier.state}</p>
        <p><strong>Pincode:</strong> {supplier.pincode}</p>
        <p><strong>Material Type:</strong> {supplier.materialType}</p>
        <p><strong>PAN Number:</strong> {supplier.panNumber}</p>
        <p><strong>GST Number:</strong> {supplier.gstNumber}</p>
        <p><strong>Aadhar Number:</strong> {supplier.aadharNumber}</p>
        
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SupplierModal;
