const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users - liste tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username FROM users ORDER BY username');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
