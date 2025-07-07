// 📁 frontend/src/components/Auth/ForgotPassword.jsx

import React from 'react';
import PasswordReset from './PasswordReset';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6">
        <h2 className="text-3xl font-extrabold text-center text-white mb-4">
          🔐 Forgot Your Password?
        </h2>
        <p className="text-gray-300 text-center mb-6 text-sm">
          Enter your registered email to receive a one-time code and reset your password securely.
        </p>

        <PasswordReset />

        <p className="mt-6 text-xs text-gray-400 text-center">
          Remembered your password?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">
            Go back to login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
