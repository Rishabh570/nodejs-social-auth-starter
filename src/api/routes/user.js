const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ data: req.user });
})

module.exports = router;