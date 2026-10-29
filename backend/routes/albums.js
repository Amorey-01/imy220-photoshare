const router = require('express').Router();
const albums = require('../data/albums');
const posts = require('../data/posts');
const users = require('../data/users');
const { oid, httpError, parseTags } = require('../db');
const { auth } = require('../middleware');

router.use(auth);

const canManage = (req, album) => req.user.isAdmin || String(album.ownerId) === String(req.user._id);
async function load(req) {
  const id = oid(req.params.id);
  const album = id && (await albums.findById(id));
  if (!album) throw httpError(404, 'Album not found');
  return album;
}

router.get('/', async (req, res) => {
  const { ownerId, q } = req.query;
  const filter = {};
  if (ownerId) filter.ownerId = oid(ownerId);
  if (q) {
    const re = { $regex: users.escapeRe(q.replace(/^#/, '')), $options: 'i' };
    filter.$or = [{ name: re }, { description: re }, { hashtags: re }];
  }
  const list = await albums.find(filter);
  const covers = await Promise.all(list.map(async (a) => (a.postIds[0] ? (await posts.findRaw(a.postIds[0]))?.image : null)));
  res.json(list.map((a, i) => ({ ...a, cover: covers[i] || null })));
});

router.get('/:id', async (req, res) => res.json(await albums.withPosts(await load(req))));

router.post('/', async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) throw httpError(400, 'Album name is required');
  const album = await albums.create({
    ownerId: req.user._id, name: name.slice(0, 60), description: String(req.body.description || '').slice(0, 300),
    hashtags: parseTags(req.body.hashtags),
  });
  res.status(201).json(album);
});

router.put('/:id', async (req, res) => {
  const album = await load(req);
  if (!canManage(req, album)) throw httpError(403, 'You can only edit your own albums');
  const fields = {};
  if (req.body.name !== undefined) {
    if (!String(req.body.name).trim()) throw httpError(400, 'Album name is required');
    fields.name = String(req.body.name).trim().slice(0, 60);
  }
  if (req.body.description !== undefined) fields.description = String(req.body.description).slice(0, 300);
  if (req.body.hashtags !== undefined) fields.hashtags = parseTags(req.body.hashtags);
  await albums.update(album._id, fields);
  res.json(await albums.withPosts(await albums.findById(album._id)));
});

router.delete('/:id', async (req, res) => {
  const album = await load(req);
  if (!canManage(req, album)) throw httpError(403, 'You can only delete your own albums');
  await albums.remove(album._id);
  res.json({ success: true });
});

router.post('/:id/posts', async (req, res) => {
  const album = await load(req);
  if (!canManage(req, album)) throw httpError(403, 'You can only change your own albums');
  const postId = oid(req.body.postId);
  if (!postId || !(await posts.findRaw(postId))) throw httpError(404, 'Post not found');
  await albums.addPost(album._id, postId);
  res.json(await albums.withPosts(await albums.findById(album._id)));
});

router.delete('/:id/posts/:postId', async (req, res) => {
  const album = await load(req);
  if (!canManage(req, album)) throw httpError(403, 'You can only change your own albums');
  await albums.removePost(album._id, oid(req.params.postId));
  res.json(await albums.withPosts(await albums.findById(album._id)));
});

module.exports = router;