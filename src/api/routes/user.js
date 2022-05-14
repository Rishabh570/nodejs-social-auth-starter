const express = require('express');
const { storeSessionId } = require('../../services/user');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ data: req.user });
})

module.exports = router;