import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import ReadPostPage from './pages/ReadPostPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={<ReadPostPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
