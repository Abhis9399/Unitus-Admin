// pages/admin/suppliers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Suppliers = () => {
  const { register, handleSubmit, reset } = useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/supplier');
      setSuppliers(response.data.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === 'documents' || key === 'profilePicture') {
          for (const fileKey in data[key]) {
            if (data[key][fileKey][0]) {
              formData.append(`${key}[${fileKey}]`, data[key][fileKey][0]);
            }
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      await axios.post('/api/supplier', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchSuppliers();
      reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Suppliers</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 transition duration-300 ease-in-out hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Create Supplier'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              {...register('representativeName')}
              placeholder="Representative Name"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('contact')}
              placeholder="Contact"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('companyName')}
              placeholder="Company Name"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('location')}
              placeholder="Location"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('address')}
              placeholder="Address"
              className="p-2 border rounded w-full"
            />
            <input
              type="url"
              {...register('mapLink')}
              placeholder="Map Link"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('materialType')}
              placeholder="Material Type"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('annualTurnover')}
              placeholder="Annual Turnover"
              className="p-2 border rounded w-full"
            />
            <input
              type="number"
              {...register('numberOfEmployees')}
              placeholder="Number of Employees"
              className="p-2 border rounded w-full"
            />
            <input
              type="number"
              {...register('relationshipLevel')}
              placeholder="Relationship Level (1-10)"
              className="p-2 border rounded w-full"
            />
            <input
              type="number"
              {...register('relationshipYears')}
              placeholder="Relationship Years"
              className="p-2 border rounded w-full"
            />
            <select {...register('inHouseLogistics')} className="p-2 border rounded w-full">
              <option value="">In-house Logistics</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="don't know">Don't Know</option>
            </select>

            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-semibold">Profile Picture</label>
              <input
                type="file"
                {...register('profilePicture')}
                className="p-2 border rounded w-full"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-semibold">Documents</label>
              {['panCard', 'aadhar', 'gst', 'cancelledCheck', 'registrationCertificate', 'productCertificate'].map(doc => (
                <div key={doc} className="mb-2">
                  <label className="block mb-1 font-semibold capitalize">{doc.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="file"
                    {...register(`documents.${doc}`)}
                    className="p-2 border rounded w-full"
                  />
                </div>
              ))}
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-semibold">Bank Details</label>
              <input
                type="text"
                {...register('documents.bankDetails.accountNumber')}
                placeholder="Bank Account Number"
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="text"
                {...register('documents.bankDetails.ifsc')}
                placeholder="Bank IFSC"
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="text"
                {...register('documents.bankDetails.bankName')}
                placeholder="Bank Name"
                className="p-2 border rounded w-full mb-2"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600">
            Add Supplier
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4">All Suppliers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Company Name</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td className="border px-4 py-2">{supplier.representativeName}</td>
                <td className="border px-4 py-2">{supplier.contact}</td>
                <td className="border px-4 py-2">{supplier.companyName}</td>
                <td className="border px-4 py-2">{supplier.location}</td>
                <td className="border px-4 py-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
