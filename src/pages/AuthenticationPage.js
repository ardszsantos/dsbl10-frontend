import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  // Include username in the initial state for registration
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    identifier: '' // This will be used for login
  });
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form data when toggling between login and register
    setFormData({ email: '', username: '', password: '', identifier: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const data = isLogin ? { identifier: formData.identifier, password: formData.password }
                         : { email: formData.email, username: formData.username, password: formData.password };

    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, data);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Authentication Error:', error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <div>
              <label className="block mb-1">Email or Username</label>
              <input
                type="text"
                name="identifier"
                className="w-full px-3 py-2 border rounded"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center">
          <button onClick={toggleMode} className="text-blue-500 hover:underline">
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;