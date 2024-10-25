// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import ReadPostPage from './pages/ReadPostPage'; // Nova página do post
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/post/:id" element={<ReadPostPage />} /> {/* Nova rota */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
