import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tight">SplitSpace</Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">Welcome back</h2>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center mt-2 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
