const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// GET user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        name: user.fullName,
        email: user.email,
        age: user.age || null,
        lastLogin: user.lastLogin || null
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PATCH update only the user's name
router.patch('/profile/name', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Name is required' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName: name },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Name updated successfully',
      user: {
        name: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating name',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ PATCH update name and age
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name && !age) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name or age) is required'
      });
    }

    const updates = {};
    if (name) updates.fullName = name;
    if (age !== undefined) updates.age = age;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: user.fullName,
        email: user.email,
        age: user.age
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PUT update user password
router.put('/password', verifyToken, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 8 characters' 
    });
  }

  try {
    const user = await User.findById(req.user.id);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      messagze: 'Error updating password',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE user account
router.delete('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting account',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
