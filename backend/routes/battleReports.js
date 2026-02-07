const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireSelfOrAdmin, requireSelfOrAdminOnBodyUserId } = require('../auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT br.id, br.user_id, br.title, br.content, u.username as author, br.created_at FROM battle_reports br JOIN users u ON br.user_id = u.id ORDER BY br.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/', requireAuth, requireSelfOrAdminOnBodyUserId, async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    const [result] = await db.query('INSERT INTO battle_reports (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())', [user_id, title, content]);
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.put('/:id', requireSelfOrAdmin(async (req) => {
  const [rows] = await db.query('SELECT user_id FROM battle_reports WHERE id = ?', [req.params.id]);
  return rows[0]?.user_id || null;
}), async (req, res) => {
  try {
    const { title, content } = req.body;
    await db.query('UPDATE battle_reports SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.delete('/:id', requireSelfOrAdmin(async (req) => {
  const [rows] = await db.query('SELECT user_id FROM battle_reports WHERE id = ?', [req.params.id]);
  return rows[0]?.user_id || null;
}), async (req, res) => {
  try {
    await db.query('DELETE FROM battle_reports WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
