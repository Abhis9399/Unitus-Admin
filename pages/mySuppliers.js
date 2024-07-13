import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import supplier from '@/model/supplier';
import mongoose from 'mongoose';

const Suppliers = ({initialSuppliers}) => {
  const { register, handleSubmit, reset } = useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);


  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append basic fields
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);

    });

    // Append profile picture
    formData.append('profilePicture', data.profilePicture[0]);

    try {
      const res = await axios.post('/api/supplier', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Supplier added successfully:', res.data);
      // Optionally reset the form after successful submission
      reset();
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
              placeholder="Contact Number"
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
              {...register('address')}
              placeholder="Company Address"
              className="p-2 border rounded w-full"
            />
            <input
              type="url"
              {...register('mapLink')}
              placeholder="Company Map Link"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('city')}
              placeholder="City"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('state')}
              placeholder="State"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('pincode')}
              placeholder="Pincode"
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
              {...register('panNumber')}
              placeholder="PAN Number"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('gstNumber')}
              placeholder="GST Number"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              {...register('aadharNumber')}
              placeholder="Aadhar Number"
              className="p-2 border rounded w-full"
            />
          

            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-semibold">Profile Picture</label>
              <input
                type="file"
                {...register('profilePicture')}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Include other documents input as needed */}

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600"
            >
              Add Supplier
            </button>
          </div>
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
              <th className="py-2 px-4 border">Material-Type</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSuppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td className="border px-4 py-2">{supplier.representativeName}</td>
                <td className="border px-4 py-2">{supplier.contact}</td>
                <td className="border px-4 py-2">{supplier.companyName}</td>
                <td className="border px-4 py-2">{supplier.materialType}</td>
                <td className="border px-4 py-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">
                    View
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
export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGODB_URL_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const suppliers = await supplier.find({}).lean();
  
  return {
    props: {
      initialSuppliers: JSON.parse(JSON.stringify(suppliers)),
    },
  };
}


export default Suppliers;
