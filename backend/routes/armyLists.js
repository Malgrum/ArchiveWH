const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT al.id, al.name, al.faction, al.content, u.username as author FROM army_lists al JOIN users u ON al.user_id = u.id ORDER BY al.id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, name, faction, content } = req.body;
    const [result] = await db.query('INSERT INTO army_lists (user_id, name, faction, content, created_at) VALUES (?, ?, ?, ?, NOW())', [user_id, name, faction, content]);
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
