// 📁 backend/routes/password.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const sendEmail = require('../utils/sendEmail');
const { verifyToken } = require('../middleware/auth');

// 🔐 STEP 1: Public - Request OTP via email
router.post('/public/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = Math.floor(100000 + Math.random() * 900000).toString();

  await PasswordResetToken.deleteMany({ userId: user._id }); // Remove any old tokens
  const newToken = new PasswordResetToken({ userId: user._id, token });
  await newToken.save();

  const html = `<h2>Your verification code is: ${token}</h2><p>This code is valid for 10 minutes.</p>`;
  await sendEmail(email, '🔐 Password Reset Code', html);

  res.json({ message: 'Verification code sent to your email.' });
});

// 🔐 STEP 2: Public - Verify OTP
router.post('/public/verify-token', async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ message: 'Email and token are required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const found = await PasswordResetToken.findOne({ userId: user._id, token });
  if (!found) return res.status(400).json({ message: 'Invalid or expired verification code' });

  const isExpired = Date.now() - found.createdAt.getTime() > 10 * 60 * 1000;
  if (isExpired) {
    await PasswordResetToken.deleteMany({ userId: user._id });
    return res.status(400).json({ message: 'Verification code expired' });
  }

  res.json({ message: 'OTP verified' });
});

// 🔐 STEP 3: Public - Reset Password
router.post('/public/verify-reset', async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'Email, token, and new password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const found = await PasswordResetToken.findOne({ userId: user._id, token });
  if (!found) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashed });
  await PasswordResetToken.deleteMany({ userId: user._id });

  res.json({ message: 'Password updated successfully!' });
});

module.exports = router;
