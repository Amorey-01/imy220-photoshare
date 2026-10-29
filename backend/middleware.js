const jwt = require('jsonwebtoken');
const { oid, httpError } = require('./db');
const users = require('./data/users');

const SECRET = process.env.JWT_SECRET || 'frame-dev-secret-change-me';
const sign = (user) => jwt.sign({ id: String(user._id) }, SECRET, { expiresIn: '7d' });

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw httpError(401, 'Not logged in');
  let payload;
  try { payload = jwt.verify(token, SECRET); } catch { throw httpError(401, 'Session expired, please log in again'); }
  const user = await users.findById(oid(payload.id));
  if (!user) throw httpError(401, 'Account no longer exists');
  req.user = user;
  next();
}

const adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) throw httpError(403, 'Admins only');
  next();
};

module.exports = { auth, adminOnly, sign };
