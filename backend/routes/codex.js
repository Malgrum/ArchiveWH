const express = require('express');
const router = express.Router();
const db = require('../db');

// Get codex entries
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, content, created_at FROM codex ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin create codex entry
router.post('/', async (req, res) => {
  try {
    const { admin_user_id, title, content } = req.body;
    // In a real app check admin privileges
    const [result] = await db.query('INSERT INTO codex (admin_user_id, title, content, created_at) VALUES (?, ?, ?, NOW())', [admin_user_id, title, content]);
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
