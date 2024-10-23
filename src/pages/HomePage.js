// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Home Page!</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default HomePage;
