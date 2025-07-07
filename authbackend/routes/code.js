const express = require('express');
const router = express.Router();
const Code = require('../models/SavedCode');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const codes = await Code.find({ userId: req.user.id });
  res.json(codes);
});

router.post('/', verifyToken, async (req, res) => {
  const { title, code } = req.body;
  const entry = new Code({ userId: req.user.id, title, code });
  await entry.save();
  res.json(entry);
});

module.exports = router;
