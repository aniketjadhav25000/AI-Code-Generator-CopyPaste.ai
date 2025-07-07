// 📁 backend/routes/history.js
const express = require('express');
const router = express.Router();
const History = require('../models/SearchHistory');
const { verifyToken } = require('../middleware/auth');

// Get all search history
router.get('/', verifyToken, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Add a new search query to history (with result and language)
router.post('/', verifyToken, async (req, res) => {
  try {
    const entry = new History({
      userId: req.user.id,
      query: req.body.query,
      result: req.body.result || '',
      language: req.body.language || 'unknown'  // ✅ Include language
    });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error saving query' });
  }
});

// Clear all search history for a user
router.post('/clear', verifyToken, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing history' });
  }
});

// Delete a specific history item
router.post('/delete', verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    await History.deleteOne({ _id: id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

module.exports = router;
