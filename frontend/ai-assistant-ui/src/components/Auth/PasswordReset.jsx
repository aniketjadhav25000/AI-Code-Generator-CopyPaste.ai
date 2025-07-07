import React, { useState } from 'react';
import { apiPost } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

const PasswordReset = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [prevPassword, setPrevPassword] = useState(''); // Simulated previous password
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiPost('/password/public/request-reset', { email });
      setStep(2);
      toast.success(res.message);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiPost('/password/public/verify-token', { email, token: otp });

      // Simulate previous password (handle securely on backend in real app)
      setPrevPassword('oldpassword123');

      setOtpVerified(true);
      toast.success(res.message);
    } catch (err) {
      setOtpVerified(false);
      setErrorMsg(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirm) {
      return setErrorMsg('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return setErrorMsg('Password must be at least 6 characters');
    }

    if (newPassword === prevPassword) {
      return setErrorMsg('New password must be different from the current password');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiPost('/password/public/verify-reset', {
        email,
        token: otp,
        newPassword
      });

      // ✅ Custom gradient toast
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg pointer-events-auto flex items-center justify-between px-4 py-3`}
        >
          <div className="text-sm font-medium">✅ Password updated successfully!</div>
        </div>
      ), { duration: 3000 });

      // Reset fields
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirm('');
      setOtpVerified(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-6 bg-transparent text-white border border-gray-700 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">🔐 Reset Your Password</h2>

      {step === 1 && (
        <>
          <label className="block mb-2 text-sm">Enter your registered email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-600"
          />
          <button
            onClick={sendOtp}
            disabled={loading || !email}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded transition font-semibold"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <label className="block mt-4 mb-2 text-sm">Enter OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="123456"
                disabled={otpVerified}
              />
              {!otpVerified ? (
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 rounded text-sm"
                  disabled={loading}
                >
                  Verify
                </button>
              ) : (
                <div className="flex items-center text-green-400 font-medium gap-1">
                  <FiCheckCircle size={18} /> Verified
                </div>
              )}
            </div>
          </form>

          {otpVerified && (
            <>
              <label className="block mt-4 mb-2 text-sm">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-4"
              />

              <label className="block mb-2 text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-4"
              />

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded transition font-semibold"
              >
                {loading ? 'Resetting...' : 'Update Password'}
              </button>
            </>
          )}
        </>
      )}

      {errorMsg && (
        <p className="text-red-400 text-sm mt-4 text-center">{errorMsg}</p>
      )}
    </div>
  );
};

export default PasswordReset;
