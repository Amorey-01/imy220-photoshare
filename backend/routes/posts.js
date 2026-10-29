const router = require('express').Router();
const posts = require('../data/posts');
const users = require('../data/users');
const social = require('../data/social');
const { oid, httpError, parseTags, ObjectId } = require('../db');
const { auth } = require('../middleware');

router.use(auth);

const MAX_IMAGE = 8 * 1024 * 1024;
const canManage = (req, post) => req.user.isAdmin || String(post.authorId) === String(req.user._id);

async function loadPost(req) {
  const id = oid(req.params.id);
  const post = id && (await posts.findRaw(id));
  if (!post) throw httpError(404, 'Post not found');
  return post;
}

// GET /api/posts?feed=local|global&q=term&userId=...
router.get('/', async (req, res) => {
  const { feed = 'global', q, userId } = req.query;
  const filter = {};
  if (userId) filter.authorId = oid(userId);
  else if (feed === 'local') filter.authorId = { $in: [req.user._id, ...req.user.friends] };
  if (q) {
    const re = { $regex: users.escapeRe(q.replace(/^#/, '')), $options: 'i' };
    const matched = await users.search(q);
    filter.$or = [{ description: re }, { hashtags: re }, { authorId: { $in: matched.map((u) => u._id) } }];
  }
  res.json(await posts.find(filter));
});

router.get('/:id', async (req, res) => {
  const id = oid(req.params.id);
  const post = id && (await posts.findById(id));
  if (!post) throw httpError(404, 'Post not found');
  res.json(post);
});

router.post('/', async (req, res) => {
  const { image, description = '', hashtags } = req.body;
  if (!image || !String(image).startsWith('data:image/')) throw httpError(400, 'An image is required');
  if (image.length > MAX_IMAGE) throw httpError(413, 'Image is too large');
  const post = await posts.create({
    authorId: req.user._id, image, description: String(description).slice(0, 500), hashtags: parseTags(hashtags),
  });
  res.status(201).json((await posts.findById(post._id)));
});

router.put('/:id', async (req, res) => {
  const post = await loadPost(req);
  if (!canManage(req, post)) throw httpError(403, 'You can only edit your own posts');
  const fields = {};
  if (req.body.description !== undefined) fields.description = String(req.body.description).slice(0, 500);
  if (req.body.hashtags !== undefined) fields.hashtags = parseTags(req.body.hashtags);
  await posts.update(post._id, fields);
  res.json(await posts.findById(post._id));
});

router.delete('/:id', async (req, res) => {
  const post = await loadPost(req);
  if (!canManage(req, post)) throw httpError(403, 'You can only delete your own posts');
  await posts.remove(post._id);
  res.json({ success: true });
});

router.post('/:id/like', async (req, res) => {
  const post = await loadPost(req);
  const liked = post.likes.some((l) => String(l) === String(req.user._id));
  await posts.toggleLike(post._id, req.user._id, liked);
  res.json(await posts.findById(post._id));
});

router.post('/:id/comments', async (req, res) => {
  const post = await loadPost(req);
  const text = String(req.body.text || '').trim();
  if (!text) throw httpError(400, 'Comment cannot be empty');
  await posts.addComment(post._id, { _id: new ObjectId(), userId: req.user._id, text: text.slice(0, 300), createdAt: new Date() });
  res.status(201).json(await posts.findById(post._id));
});

router.delete('/:id/comments/:commentId', async (req, res) => {
  const post = await loadPost(req);
  const comment = post.comments.find((c) => String(c._id) === req.params.commentId);
  if (!comment) throw httpError(404, 'Comment not found');
  const allowed = canManage(req, post) || String(comment.userId) === String(req.user._id);
  if (!allowed) throw httpError(403, 'Not allowed to delete this comment');
  await posts.removeComment(post._id, comment._id);
  res.json(await posts.findById(post._id));
});

router.post('/:id/report', async (req, res) => {
  const post = await loadPost(req);
  const reasonId = oid(req.body.reasonId);
  const reason = reasonId && (await social.reasons.find(reasonId));
  if (!reason) throw httpError(400, 'Choose a reason for the report');
  if (await social.reports.exists(post._id, req.user._id)) throw httpError(409, 'You already reported this post');
  await social.reports.create({
    postId: post._id, reporterId: req.user._id, reasonId, reason: reason.text, details: String(req.body.details || '').slice(0, 300),
  });
  res.status(201).json({ success: true });
});

module.exports = router;
