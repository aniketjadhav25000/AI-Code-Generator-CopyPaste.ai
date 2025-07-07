// 📁 frontend/src/components/user/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../services/api';
import toast from 'react-hot-toast';
import { Clock, User, CalendarDays, History } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access your dashboard.');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const profileRes = await apiGet('/user/profile');
        const historyRes = await apiGet('/history');

        setEmail(profileRes.email || '');
        setCreatedAt(profileRes.createdAt?.slice(0, 10) || '');
        setHistory(historyRes.slice(0, 5)); // show last 5
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        toast.error('Failed to load dashboard data');
      }
    };

    if (user) fetchDashboard();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white space-y-8">
      <h2 className="text-4xl font-bold text-indigo-400">Welcome back!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md flex items-center gap-4">
          <User className="text-indigo-300" />
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-semibold">{email}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md flex items-center gap-4">
          <CalendarDays className="text-green-300" />
          <div>
            <p className="text-sm text-gray-400">Joined On</p>
            <p className="font-semibold">{createdAt || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md flex items-center gap-4">
          <History className="text-purple-300" />
          <div>
            <p className="text-sm text-gray-400">Total Searches</p>
            <p className="font-semibold">{history.length}</p>
          </div>
        </div>
      </div>

      {/* Recent History Section */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-purple-300">Recent History</h3>
          <button
            onClick={() => navigate('/history')}
            className="text-sm text-indigo-400 hover:underline"
          >
            View All
          </button>
        </div>
        {history.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {history.map((item, idx) => (
              <li key={idx} className="p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-300 truncate">{item.query}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No history found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
