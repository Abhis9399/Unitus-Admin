import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 px-6 rounded-t-xl">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center mb-4 lg:mb-0">
          <Image src="/LOGO.png" alt="Unitus Infra" width={50} height={50} />
          <h2 className="ml-4 text-md lg:text-xl font-bold">UNITUS INFRA</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center mb-4 lg:mb-0">
          <Link href="/" legacyBehavior>
            <a className="text-md lg:text-lg mx-2 hover:text-gray-300">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-md lg:text-lg mx-2 hover:text-gray-300">About Us</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-md lg:text-lg mx-2 hover:text-gray-300">Contact</a>
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="https://facebook.com" legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-gray-300">
              <FaFacebook />
            </a>
          </Link>
          <Link href="https://twitter.com" legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-gray-300">
              <FaTwitter />
            </a>
          </Link>
          <Link href="https://linkedin.com" legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-gray-300">
              <FaLinkedin />
            </a>
          </Link>
          <Link href="https://instagram.com" legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="mx-2 text-xl hover:text-gray-300">
              <FaInstagram />
            </a>
          </Link>
        </div>
      </div>
      <div className="text-center mt-4 ml-24">
        <p className="text-md lg:text-lg">&copy; 2024 Unitus Infra. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
