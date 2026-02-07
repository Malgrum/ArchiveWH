const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

// Get codex entries
router.get('/', async (req, res) => {
  try {
    const { universe, mode, faction } = req.query;
    const filters = [];
    const params = [];

    if (universe) {
      filters.push('universe = ?');
      params.push(universe);
    }
    if (mode) {
      filters.push('mode = ?');
      params.push(mode);
    }
    if (faction) {
      filters.push('faction = ?');
      params.push(faction);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows] = await db.query(
      `SELECT id, title, universe, mode, faction,
        range_weapons, melee_weapons,
        range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
        melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
        abilitie, points, keywords, created_at
       FROM codex ${whereClause} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin create codex entry
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      universe, mode, faction,
      range_weapons, melee_weapons,
      range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
      melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
      abilitie, points, keywords
    } = req.body;

    const rangeWeaponsJson = range_weapons ? JSON.stringify(range_weapons) : null;
    const meleeWeaponsJson = melee_weapons ? JSON.stringify(melee_weapons) : null;

    const [result] = await db.query(
      `INSERT INTO codex (
        admin_user_id, title, universe, mode, faction,
        range_weapons, melee_weapons,
        range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
        melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
        abilitie, points, keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        req.requester.id, title, universe, mode, faction,
        rangeWeaponsJson, meleeWeaponsJson,
        range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
        melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
        abilitie, points, keywords
      ]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      universe, mode, faction,
      range_weapons, melee_weapons,
      range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
      melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
      abilitie, points, keywords
    } = req.body;

    const rangeWeaponsJson = range_weapons ? JSON.stringify(range_weapons) : null;
    const meleeWeaponsJson = melee_weapons ? JSON.stringify(melee_weapons) : null;

    await db.query(
      `UPDATE codex SET
        title = ?,
        universe = ?, mode = ?, faction = ?,
        range_weapons = ?,
        melee_weapons = ?,
        range_weapon = ?, range_bonus = ?, range_range = ?, range_attacks = ?, range_strength = ?, range_ap = ?, range_damage = ?,
        melee_weapon = ?, melee_bonus = ?, melee_attacks = ?, melee_strength = ?, melee_ap = ?, melee_damage = ?,
        abilitie = ?, points = ?, keywords = ?
       WHERE id = ?`,
      [
        title,
        universe, mode, faction,
        rangeWeaponsJson,
        meleeWeaponsJson,
        range_weapon, range_bonus, range_range, range_attacks, range_strength, range_ap, range_damage,
        melee_weapon, melee_bonus, melee_attacks, melee_strength, melee_ap, melee_damage,
        abilitie, points, keywords,
        req.params.id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM codex WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
