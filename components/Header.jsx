import React, { useState } from "react";
import Link from "next/link";
import { MdAccountCircle, MdLogout } from "react-icons/md";

const Header = ({ logout, user }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center rounded-3xl">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="relative">
        {user && user.value && (
          <div className="flex items-center">
            <MdAccountCircle
              className="text-xl md:text-2xl mx-2 cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className="absolute right-0 mt-20 w-48 bg-white rounded-md shadow-lg z-10">
                <a
                  onClick={logout}
                  className="flex items-center justify-between px-10 py-3 text-md text-gray-800 hover:text-blue-600 hover:font-bold cursor-pointer"
                >
                  Logout
                  <MdLogout className="ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
