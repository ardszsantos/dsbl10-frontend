import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './createPost';
import { toast } from 'react-toastify';  // Import toast

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // State to control mobile menu

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');  // Show success toast
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);  // Toggle the mobile menu state
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-white text-lg font-bold">
          Simple Blog
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {/* Create Post Button (imported from CreatePost component) */}
          <CreatePost />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Icon (Hamburger) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (shown when isMenuOpen is true) */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2">
          <CreatePost />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
