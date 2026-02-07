const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin, requireAuth, requireSelfOrAdmin, requireSelfOrAdminOnBodyUserId, normalizeId } = require('../auth');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT al.id, al.name, al.faction, al.content, u.username as author FROM army_lists al JOIN users u ON al.user_id = u.id ORDER BY al.id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/', requireAuth, requireSelfOrAdminOnBodyUserId, async (req, res) => {
  try {
    const { user_id, name, mode, points, faction, units, content } = req.body;
    // Store units as JSON string
    const unitsJson = units ? JSON.stringify(units) : null;
    const [result] = await db.query(
      'INSERT INTO army_lists (user_id, name, mode, points, faction, units, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [user_id, name, mode, points, faction, unitsJson, content]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Lister les listes d'armée d'un utilisateur donné
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = normalizeId(req.params.userId);
    if (!userId) return res.status(400).json({ error: 'USER_ID_REQUIRED' });
    const requesterId = normalizeId(req.headers['x-user-id'] || req.query.user_id || req.body?.user_id);
    if (!requesterId) return res.status(401).json({ error: 'AUTH_REQUIRED' });
    if (requesterId !== userId) {
      const [rows] = await db.query('SELECT is_admin FROM users WHERE id = ?', [requesterId]);
      if (!rows[0]?.is_admin) return res.status(403).json({ error: 'FORBIDDEN' });
    }
    const [rows] = await db.query('SELECT id, name, faction, content FROM army_lists WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.put('/:id', requireSelfOrAdmin(async (req) => {
  const [rows] = await db.query('SELECT user_id FROM army_lists WHERE id = ?', [req.params.id]);
  return rows[0]?.user_id || null;
}), async (req, res) => {
  try {
    const { name, mode, points, faction, units, content } = req.body;
    const unitsJson = units ? JSON.stringify(units) : null;
    await db.query(
      'UPDATE army_lists SET name = ?, mode = ?, points = ?, faction = ?, units = ?, content = ? WHERE id = ?',
      [name, mode, points, faction, unitsJson, content, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.delete('/:id', requireSelfOrAdmin(async (req) => {
  const [rows] = await db.query('SELECT user_id FROM army_lists WHERE id = ?', [req.params.id]);
  return rows[0]?.user_id || null;
}), async (req, res) => {
  try {
    await db.query('DELETE FROM army_lists WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;