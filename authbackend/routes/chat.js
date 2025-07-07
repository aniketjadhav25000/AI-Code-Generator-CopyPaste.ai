const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Chat = require('../models/Chat');

// ✅ Save or update a chat
router.post('/save', verifyToken, async (req, res) => {
  const { chatId, title, messages } = req.body;

  if (!chatId || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'chatId and messages are required' });
  }

  try {
    const existing = await Chat.findOne({ chatId, user: req.user.id });

    if (existing) {
      existing.messages = messages;
      existing.title = title;
      await existing.save();
    } else {
      await Chat.create({
        chatId,
        user: req.user.id,
        title,
        messages,
      });
    }

    res.json({ message: 'Chat saved' });
  } catch (err) {
    console.error('Error saving chat:', err);
    res.status(500).json({ message: 'Server error while saving chat' });
  }
});

// ✅ Get all chats for the authenticated user
router.get('/all', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ message: 'Server error while retrieving chats' });
  }
});

// ✅ Get a specific chat by ID
router.get('/:chatId', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ chatId: req.params.chatId, user: req.user.id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(500).json({ message: 'Server error while retrieving chat' });
  }
});

// ✅ Delete a specific chat by ID
router.delete('/:chatId', verifyToken, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({
      chatId: req.params.chatId,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Chat not found or already deleted' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ message: 'Server error while deleting chat' });
  }
});

module.exports = router;
