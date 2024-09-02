import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ name: '', phone: '', password: '' });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await axios.get('/api/member');
        setMembers(response.data.data);
        setFilteredMembers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    }
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/member', newMember);
      setNewMember({ name: '', phone: '', password: '' });
      fetchMembers(); // Refresh the members list after adding a new member
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Members Management</h1>
      <form className="mb-4" onSubmit={handleAddMember}>
        <input
          type="text"
          name="name"
          value={newMember.name || ''}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="phone"
          value={newMember.phone || ''}
          onChange={handleInputChange}
          placeholder="Phone"
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          name="password"
          value={newMember.password || ''}
          onChange={handleInputChange}
          placeholder="Password"
          required
          className="border p-2 mb-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Member
        </button>
      </form>
      
      <input
        type="text"
        placeholder="Search Members"
        value={searchQuery}
        onChange={handleSearchChange}
        className="border p-2 mb-4 w-full"
      />

<div className="bg-white shadow rounded-lg p-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Existing Members</h2>
  <ul className="divide-y divide-gray-200">
    {filteredMembers.map((member) => (
      <li key={member._id} className="py-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{member.name}</div>
            <div className="text-sm text-gray-500">Phone: {member.phone}</div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Suppliers: {member.suppliers?.length || 0}
            </div>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              Users: {member.users?.length || 0}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-semibold text-gray-700">Assigned Suppliers:</div>
          <ul className="list-disc pl-5 text-gray-600">
            {member.suppliers && member.suppliers.map(supplier => (
              <li key={supplier._id} className="text-sm">
                {supplier.representativeName} - {supplier.companyName}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <div className="font-semibold text-gray-700">Assigned Users:</div>
          <ul className="list-disc pl-5 text-gray-600">
            {member.users && member.users.map(user => (
              <li key={user._id} className="text-sm">
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default MembersPage;
