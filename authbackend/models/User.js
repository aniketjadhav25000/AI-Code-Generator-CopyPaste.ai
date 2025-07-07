const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: null
  },
  preferences: {
    type: Object,
    default: {}
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
