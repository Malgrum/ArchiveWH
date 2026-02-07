const db = require('./db');

const normalizeId = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const id = Number(value);
  if (Number.isNaN(id)) return null;
  return id;
};

const getRequesterId = (req) => {
  if (req.body && req.body.user_id !== undefined) return normalizeId(req.body.user_id);
  if (req.query && req.query.user_id !== undefined) return normalizeId(req.query.user_id);
  if (req.headers && req.headers['x-user-id'] !== undefined) return normalizeId(req.headers['x-user-id']);
  return null;
};

const getRequester = async (req) => {
  const id = getRequesterId(req);
  if (!id) return null;
  const [rows] = await db.query('SELECT id, username, is_admin FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

const requireAuth = async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'AUTH_REQUIRED' });
    req.requester = requester;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'AUTH_REQUIRED' });
    if (!requester.is_admin) return res.status(403).json({ error: 'FORBIDDEN' });
    req.requester = requester;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
};

const requireSelfOrAdmin = (getOwnerId) => async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'AUTH_REQUIRED' });

    const ownerId = await getOwnerId(req);
    if (!ownerId) return res.status(404).json({ error: 'NOT_FOUND' });

    if (requester.is_admin || requester.id === ownerId) {
      req.requester = requester;
      return next();
    }

    return res.status(403).json({ error: 'FORBIDDEN' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
};

const requireSelfOrAdminOnBodyUserId = async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'AUTH_REQUIRED' });
    const bodyUserId = normalizeId(req.body?.user_id);
    if (!bodyUserId) return res.status(400).json({ error: 'USER_ID_REQUIRED' });
    if (!requester.is_admin && requester.id !== bodyUserId) return res.status(403).json({ error: 'FORBIDDEN' });
    req.requester = requester;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
};

module.exports = {
  normalizeId,
  getRequesterId,
  getRequester,
  requireAuth,
  requireAdmin,
  requireSelfOrAdmin,
  requireSelfOrAdminOnBodyUserId,
};