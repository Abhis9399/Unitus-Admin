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

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Members</h2>
        <ul className="list-disc pl-5">
          {filteredMembers.map((member) => (
            <li key={member._id} className="mb-4">
              <div className="font-bold">{member.name}</div>
              <div>Phone: {member.phone}</div>
              <div>Assigned Suppliers:</div>
              <ul className="list-disc pl-5">
                {member.suppliers && member.suppliers.map(supplier => (
                  <li key={supplier._id}>{supplier.representativeName} - {supplier.companyName}</li>
                ))}
              </ul>
              <div>Assigned Users:</div>
              <ul className="list-disc pl-5">
                {member.users && member.users.map(user => (
                  <li key={user._id}>{user.name} - {user.email}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MembersPage;
