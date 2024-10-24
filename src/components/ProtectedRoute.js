import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // Import toast

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.warning('You must be logged in to access this page.');  // Warning toast
  }
  return token ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
