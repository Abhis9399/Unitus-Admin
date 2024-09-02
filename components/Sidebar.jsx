import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { RxSketchLogo, RxDashboard, RxPerson } from "react-icons/rx";
import { FiSettings } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdLocalGroceryStore } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { RiTeamFill } from "react-icons/ri";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import { useRouter } from "next/router";
import Image from "next/image";

const Sidebar = ({ user,children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleFinancingClick = () => {
    const answer = window.confirm('Are you wanting financing help?');
    if (answer) {
      alert('Request for financing help will be generated.');
      // Further logic for generating request
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // setUser({ value: null, role: null });
    // setKey(Math.random());
    router.push('/login');
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  const adminLinks = [
    { href: "/admin/dashboard", icon: <RxSketchLogo size={20} />, text: "Home" },
    { href: "/customers", icon: <RxPerson size={20} />, text: "Customer" },
    { href: "/orders", icon: <MdLocalGroceryStore size={28} />, text: "Orders" },
    { href: "/members", icon: <RiTeamFill size={20} />, text: "Members" },
    { href: "/prices", icon: <HiOutlineShoppingBag size={28} />, text: "Prices" },
  ];

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
        <div className="flex justify-center items-center w-full mb-4">
            <Image src={'/LOGO_small.png'} width={70} height={70} alt="Logo" />
          </div>

          {user && user.role==='admin' && (
            <>
              {adminLinks.map((link,index)=>(
                <Link key={index} href={link.href}>
                <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-28 rounded-lg flex items-center transition-all w-full">
                {link.icon}
                <span className="ml-4 text-gray-700">{link.text}</span>
                </div>
                </Link>
              ))}
            </>
          )}
          <Link href="/mySuppliers">
            <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-28 rounded-lg flex items-center transition-all w-full">
              <FiSettings size={20} />
              <span className="ml-2 font-medium">Suppliers</span>
            </div>
          </Link>

         
          <button onClick={logout}>
            <div className="bg-gray-200 text-gray-900 hover:bg-blue-900 cursor-pointer my-4 p-3 pr-36
             rounded-lg flex items-center transition-all w-full">
              <MdLogout size={20} />
              <span className="ml-2 font-medium">Logout</span>
            </div>
          </button>
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

