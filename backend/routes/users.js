const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../auth');

// GET /api/users - liste tous les utilisateurs
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username FROM users ORDER BY username');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /api/users/login - connexion simple
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'CREDENTIALS_REQUIRED' });
    const [rows] = await db.query('SELECT id, username, password_hash, is_admin FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user || user.password_hash !== password) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    res.json({ id: user.id, username: user.username, is_admin: !!user.is_admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
