import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiPatch } from '../../services/api';
import { FaSpinner } from 'react-icons/fa';

const FirstTimeSetupModal = ({ token, onClose, onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const parsedAge = parseInt(age, 10);

    if (!trimmedName || !parsedAge) {
      return setError('Please fill in both fields correctly.');
    }

    if (parsedAge < 1 || parsedAge > 120) {
      return setError('Please enter a valid age between 1 and 120.');
    }

    try {
      setLoading(true);
      setError('');
      await apiPatch('/user/profile', { name: trimmedName, age: parsedAge }, token);
      onComplete({ name: trimmedName, age: parsedAge });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gray-900 p-6 rounded-xl max-w-md w-full border border-gray-700 text-white shadow-2xl backdrop-blur-md"
        >
          <h3 className="text-xl font-bold mb-4">👤 Complete Your Profile</h3>
          <p className="text-sm text-gray-400 mb-4">Please provide your name and age to continue.</p>

          <div className="space-y-4 mb-4">
            <div>
              <label className="text-sm">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-600 focus:ring-1 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm">Age</label>
              <input
                type="number"
                className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-600 focus:ring-1 focus:ring-indigo-500"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 rounded font-semibold text-sm transition-all ${
                loading
                  ? 'bg-indigo-500 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <FaSpinner className="animate-spin" /> Saving...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FirstTimeSetupModal;
