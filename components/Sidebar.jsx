import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { RxSketchLogo, RxDashboard, RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdLocalGroceryStore } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleFinancingClick = () => {
    const answer = window.confirm('Are you wanting financing help?');
    if (answer) {
      alert('Request for financing help will be generated.');
      // Further logic for generating request
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex">
      <div ref={sidebarRef} className={`fixed z-10 w-60 h-screen p-4 bg-gray-300 text-white flex flex-col justify-between shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col items-center">
        <Link href="/">
            <div className="bg-white text-blue-900 p-3 rounded-lg flex items-center mb-4 cursor-pointer hover:bg-gray-200 transition-all">
              <RxSketchLogo size={20} />
              <span className="ml-2 font-medium">Home</span>
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-300 w-full p-2"></span>
          <Link href="/">
            <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-24 rounded-lg flex items-center transition-all w-full">
              <RxDashboard size={20} />
              <span className="ml-2 font-medium">Dashboard</span>
            </div>
          </Link>
          <Link href="/customers">
          <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-24 rounded-lg flex items-center transition-all w-full">
              <RxPerson size={20} />
              <span className="ml-2 font-medium">Customers</span>
            </div>
          </Link>

          <Link href="/mySuppliers">
          <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-28 rounded-lg flex items-center transition-all w-full">
              <FiSettings size={20} />
              <span className="ml-2 font-medium">Suppliers</span>
            </div>
          </Link>

          <Link href="/orders">
            <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-32 rounded-lg flex items-center transition-all w-full">
              <MdLocalGroceryStore size={20} />
              <span className="ml-2 font-medium">Orders</span>
            </div>
          </Link>
      
        </div>
      </div>
      <main className="flex-1 p-4 bg-gray-100 min-h-screen lg:ml-60">
        <button
          className="lg:hidden bg-blue-900 text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;

