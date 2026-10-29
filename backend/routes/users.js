const router = require('express').Router();
const users = require('../data/users');
const social = require('../data/social');
const { oid, httpError } = require('../db');
const { auth } = require('../middleware');

router.use(auth);

const loadTarget = async (req) => {
  const id = oid(req.params.id);
  const target = id && (await users.findById(id, users.PUBLIC));
  if (!target) throw httpError(404, 'User not found');
  return target;
};
const canManage = (req, target) => req.user.isAdmin || String(req.user._id) === String(target._id);

router.get('/', async (req, res) => res.json(await users.search(req.query.q)));

router.get('/:id', async (req, res) => {
  const target = await loadTarget(req);
  const me = req.user;
  let friendStatus = 'none';
  if (String(me._id) === String(target._id)) friendStatus = 'self';
  else if (me.friends.some((f) => String(f) === String(target._id))) friendStatus = 'friends';
  else if (await social.findRequest(me._id, target._id)) friendStatus = 'sent';
  else if (await social.findRequest(target._id, me._id)) friendStatus = 'received';

  const isFriendOrSelfOrAdmin = me.isAdmin || friendStatus === 'self' || friendStatus === 'friends';
  const friends = isFriendOrSelfOrAdmin ? await users.findMany(target.friends, { username: 1, name: 1, profilePic: 1 }) : [];

  if (!isFriendOrSelfOrAdmin) {
    return res.json({
      _id: target._id,
      username: target.username,
      name: target.name,
      profilePic: target.profilePic,
      friends,
      friendStatus
    });
  }

  res.json({ ...target, friends, friendStatus });
});

router.put('/:id', async (req, res) => {
  const target = await loadTarget(req);
  if (!canManage(req, target)) throw httpError(403, 'You can only edit your own profile');
  const { username, name, bio, profilePic } = req.body;
  const fields = {};
  if (username !== undefined && username !== target.username) {
    if (!/^[\w.]{3,20}$/.test(username)) throw httpError(400, 'Username must be 3-20 letters, numbers, dots or underscores');
    const clash = await users.findByUsername(username);
    if (clash && String(clash._id) !== String(target._id)) throw httpError(409, 'That username is taken');
    fields.username = username;
  }
  if (name !== undefined) fields.name = String(name).slice(0, 60);
  if (bio !== undefined) fields.bio = String(bio).slice(0, 300);
  if (profilePic !== undefined) fields.profilePic = profilePic;
  if (Object.keys(fields).length) await users.update(target._id, fields);
  res.json(await users.findById(target._id, users.PUBLIC));
});

router.delete('/:id', async (req, res) => {
  const target = await loadTarget(req);
  if (!canManage(req, target)) throw httpError(403, 'You can only delete your own account');
  await users.remove(target._id);
  res.json({ success: true });
});

module.exports = router;