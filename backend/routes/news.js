const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

// Get all news
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT n.id, n.title, n.content, n.created_at, u.username as author FROM news n JOIN users u ON n.admin_user_id = u.id ORDER BY n.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin create news
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'TITLE_CONTENT_REQUIRED' });
    const [result] = await db.query(
      'INSERT INTO news (admin_user_id, title, content, created_at) VALUES (?, ?, ?, NOW())',
      [req.requester.id, title, content]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
