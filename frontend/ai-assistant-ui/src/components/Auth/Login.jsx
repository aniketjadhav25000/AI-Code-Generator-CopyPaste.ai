import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remainingResponses, setRemainingResponses] = useState(0);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    const count = parseInt(localStorage.getItem('guest-response-count')) || 0;
    setRemainingResponses(Math.max(0, 3 - count));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiPost('/auth/login', { email, password });
      login(res.token);
      localStorage.removeItem('guest-response-count');
      navigate('/');
    } catch (err) {
      const msg = err?.message?.toLowerCase() || '';
      if (msg.includes('incorrect')) {
        setErrorMsg('❌ Password is incorrect');
      } else if (msg.includes('not found')) {
        setErrorMsg('❌ User not found');
      } else {
        setErrorMsg('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl p-8 shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <FiLogIn /> Login
        </h2>

        {!user && (
          <div className="text-center text-sm text-cyan-300">
            🚀 You have <span className="font-bold text-white">{remainingResponses}</span> free responses left as a guest.
          </div>
        )}

        <div>
          <label className="text-sm mb-1 block text-slate-300">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        <div className="relative">
          <label className="text-sm mb-1 block text-slate-300">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[36px] right-3 text-slate-400 hover:text-white transition"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {errorMsg && (
          <motion.div
            className="text-sm text-red-400 -mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMsg}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-slate-400 hover:underline"
          >
            Don’t have an account? Register
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
