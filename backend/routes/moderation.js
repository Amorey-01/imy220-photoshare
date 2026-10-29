const router = require('express').Router();
const social = require('../data/social');
const users = require('../data/users');
const posts = require('../data/posts');
const { oid, httpError } = require('../db');
const { auth, adminOnly } = require('../middleware');

router.use(auth);

// everyone can read reasons (needed by the report form); only admins change them
router.get('/reasons', async (req, res) => res.json(await social.reasons.all()));
router.post('/reasons', adminOnly, async (req, res) => {
  const text = String(req.body.text || '').trim();
  if (!text) throw httpError(400, 'Reason text is required');
  await social.reasons.create(text.slice(0, 80));
  res.status(201).json(await social.reasons.all());
});
router.delete('/reasons/:id', adminOnly, async (req, res) => {
  await social.reasons.remove(oid(req.params.id));
  res.json(await social.reasons.all());
});

router.get('/reports', adminOnly, async (req, res) => {
  const list = await social.reports.all();
  const reporters = await users.findMany(list.map((r) => r.reporterId), { username: 1 });
  const rMap = Object.fromEntries(reporters.map((u) => [String(u._id), u.username]));
  const full = await Promise.all(list.map(async (r) => ({
    ...r, reporter: rMap[String(r.reporterId)] || '[deleted]', post: await posts.findById(r.postId),
  })));
  res.json(full);
});
router.delete('/reports/:id', adminOnly, async (req, res) => {
  await social.reports.remove(oid(req.params.id));
  res.json({ success: true });
});

module.exports = router;
