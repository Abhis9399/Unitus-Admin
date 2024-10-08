import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import SupplierModal from '@/components/supplier';
import Supplier from '@/model/supplier'
import Member from '@/model/Member';
import { connectToDatabase } from '@/mongoose/mongodbUser';

const Suppliers = ({ initialSuppliers }) => {
  const { register, handleSubmit, reset } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await axios.get('/api/member');
        setMembers(res.data.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    }
    fetchMembers();
  }, []);

  const onSubmit = async (data) => {
    // Process data before sending
    const formattedData = {
      ...data,
      materialType: data.materialType.split(',').map(item => item.trim()), // Convert to array
      numberofVehicles: parseInt(data.numberofVehicles, 10),
      dailyCapacity: parseInt(data.dailyCapacity, 10),
    };

    try {
      const res = await axios.post('/api/supplier', formattedData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Supplier added successfully:', res.data);
      reset();
    } catch (error) {
      console.error('Error adding supplier:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Suppliers</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-900 text-white px-4 py-2 rounded mb-4 transition duration-300 ease-in-out hover:bg-blue-600"
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
              placeholder="Material Type (comma separated)"
              className="p-2 border rounded w-full"
            />
            <input
              type="number"
              {...register('numberofVehicles')}
              placeholder="No. of Vehicles"
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
            <input
              type="email"
              {...register('email')}
              placeholder="Email"
              className="p-2 border rounded w-full"
            />
            <input
              type="password"
              {...register('password')}
              placeholder="Password"
              className="p-2 border rounded w-full"
            />

            {/* Dropdown for selecting a member */}
            <select
              {...register('assignedMember')}
              className="p-2 border rounded w-full"
            >
              <option value="">Select a Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-900 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600"
          >
            Add Supplier
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4">All Suppliers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialSuppliers.map((supplier) => (
          <div key={supplier._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{supplier.representativeName}</h3>
            <p className="mb-1"><strong>Contact:</strong> {supplier.contact}</p>
            <p className="mb-1"><strong>Company:</strong> {supplier.companyName}</p>
            <p className="mb-1"><strong>Materials:</strong> {Array.isArray(supplier.materialType) ? supplier.materialType.join(', ') : supplier.materialType}</p>
            
            <button
              onClick={() => setSelectedSupplier(supplier)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {selectedSupplier && (
        <SupplierModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
};

export async function getServerSideProps() {
  await connectToDatabase();

  const suppliers = await Supplier.find({}).populate('assignedMember').exec();

  return {
    props: {
      initialSuppliers: JSON.parse(JSON.stringify(suppliers)),
    },
  };
}

export default Suppliers;
