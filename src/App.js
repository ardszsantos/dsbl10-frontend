import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute.js'; // Assuming you save this in a separate file or adjust import accordingly

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
