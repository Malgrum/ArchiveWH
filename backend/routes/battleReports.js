const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT br.id, br.title, br.content, u.username as author, br.created_at FROM battle_reports br JOIN users u ON br.user_id = u.id ORDER BY br.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    const [result] = await db.query('INSERT INTO battle_reports (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())', [user_id, title, content]);
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
