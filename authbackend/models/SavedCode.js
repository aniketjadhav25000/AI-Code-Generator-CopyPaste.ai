const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  code: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedCode', codeSchema);
