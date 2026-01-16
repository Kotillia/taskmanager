import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; 
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      
     
      login(res.data.token, res.data.user);
      
      alert('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.. Is everything is correct?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl text-white">
            <LogIn size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Here we go again..</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-200">
            Log in!
          </button>
        </form>

       
        <p className="mt-8 text-center text-sm text-slate-600">
          You dont have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;