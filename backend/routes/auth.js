const router = require('express').Router();
const bcrypt = require('bcryptjs');
const users = require('../data/users');
const { httpError } = require('../db');
const { auth, sign } = require('../middleware');

const clean = ({ passwordHash, ...u }) => u;

router.post('/signup', async (req, res) => {
  const { username = '', email = '', password = '' } = req.body;
  if (!/^[\w.]{3,20}$/.test(username)) throw httpError(400, 'Username must be 3-20 letters, numbers, dots or underscores');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, 'Enter a valid email address');
  if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters');
  if (await users.findByEmail(email)) throw httpError(409, 'That email is already registered');
  if (await users.findByUsername(username)) throw httpError(409, 'That username is taken');
  const user = await users.create({
    username, name: username, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 10),
  });
  res.status(201).json({ token: sign(user), user: clean(user) });
});

router.post('/login', async (req, res) => {
  const { email = '', password = '' } = req.body;
  const user = await users.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw httpError(401, 'Incorrect email or password');
  res.json({ token: sign(user), user: clean(user) });
});

// JWTs are stateless, so logout is acknowledged here and the client discards its token.
router.post('/logout', auth, (req, res) => res.json({ success: true }));

router.get('/me', auth, (req, res) => res.json({ user: clean(req.user) }));

module.exports = router;
