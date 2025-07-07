// 📁 backend/models/SearchHistory.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  result: { type: String, default: '' },
  language: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', historySchema);
