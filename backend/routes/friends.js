const router = require('express').Router();
const users = require('../data/users');
const social = require('../data/social');
const { oid, httpError } = require('../db');
const { auth } = require('../middleware');

router.use(auth);

const target = async (req) => {
  const id = oid(req.params.userId);
  if (!id || String(id) === String(req.user._id)) throw httpError(400, 'Invalid user');
  if (!(await users.findById(id))) throw httpError(404, 'User not found');
  return id;
};
const isFriend = (me, id) => me.friends.some((f) => String(f) === String(id));

// pending requests addressed to me
router.get('/requests', async (req, res) => {
  const reqs = await social.incoming(req.user._id);
  const from = await users.findMany(reqs.map((r) => r.from), { username: 1, name: 1, profilePic: 1 });
  res.json(from);
});

router.post('/request/:userId', async (req, res) => {
  const id = await target(req);
  if (isFriend(req.user, id)) throw httpError(400, 'Already friends');
  if (await social.findRequest(req.user._id, id)) throw httpError(400, 'Request already sent');
  if (await social.findRequest(id, req.user._id)) { // they already asked us: just accept
    await social.deleteRequest(id, req.user._id);
    await users.addFriend(req.user._id, id); await users.addFriend(id, req.user._id);
    return res.json({ friendStatus: 'friends' });
  }
  await social.createRequest(req.user._id, id);
  res.status(201).json({ friendStatus: 'sent' });
});

router.post('/accept/:userId', async (req, res) => {
  const id = await target(req);
  if (!(await social.findRequest(id, req.user._id))) throw httpError(404, 'No request from that user');
  await social.deleteRequest(id, req.user._id);
  await users.addFriend(req.user._id, id); await users.addFriend(id, req.user._id);
  res.json({ friendStatus: 'friends' });
});

router.post('/decline/:userId', async (req, res) => {
  const id = await target(req);
  await social.deleteRequest(id, req.user._id);
  res.json({ friendStatus: 'none' });
});

// unfriend, or cancel a request I sent
router.delete('/:userId', async (req, res) => {
  const id = await target(req);
  await users.removeFriend(req.user._id, id); await users.removeFriend(id, req.user._id);
  await social.deleteRequest(req.user._id, id);
  res.json({ friendStatus: 'none' });
});

module.exports = router;
