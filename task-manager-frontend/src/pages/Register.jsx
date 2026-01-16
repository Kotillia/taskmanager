import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    username: '',
    password: '',
    token: searchParams.get('token') || '' 
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/auth/register', formData);

        login(res.data.token, res.data.user);
        navigate('/dashboard');
      
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong..');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl text-white">
            <UserPlus size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create an account</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Join us and be productive!
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          {formData.token && (
            <div className="p-2 bg-green-50 text-green-700 text-xs rounded border border-green-100">
              Oh! Someone invited you! How sweet..
            </div>
          )}

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;