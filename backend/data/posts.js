const { col, oid, ObjectId } = require('../db');

const findRaw = (id) => col('posts').findOne({ _id: oid(id) });

async function attachAuthors(postList) {
  const authorIds = [...new Set(postList.map((p) => String(p.authorId)).filter(Boolean))].map((id) => oid(id));
  const authors = await col('users').find({ _id: { $in: authorIds } }, { projection: { username: 1, name: 1, profilePic: 1 } }).toArray();
  const authorMap = new Map(authors.map((u) => [String(u._id), u]));

  const commentUserIds = [...new Set(postList.flatMap((p) => (p.comments || []).map((c) => String(c.userId))).filter(Boolean))].map((id) => oid(id));
  const commentUsers = commentUserIds.length ? await col('users').find({ _id: { $in: commentUserIds } }, { projection: { username: 1, name: 1, profilePic: 1 } }).toArray() : [];
  const commentUserMap = new Map(commentUsers.map((u) => [String(u._id), u]));

  return postList.map((p) => ({
    ...p,
    author: authorMap.get(String(p.authorId)) || { username: '[deleted]', name: 'Deleted User', profilePic: '' },
    comments: (p.comments || []).map((c) => ({
      ...c,
      author: commentUserMap.get(String(c.userId)) || { username: '[deleted]' },
    })),
  }));
}

async function find(filter = {}) {
  const list = await col('posts').find(filter).sort({ createdAt: -1 }).toArray();
  return attachAuthors(list);
}

async function findById(id) {
  const post = await col('posts').findOne({ _id: oid(id) });
  if (!post) return null;
  const [enriched] = await attachAuthors([post]);
  return enriched;
}

async function create(p) {
  const doc = { description: '', hashtags: [], comments: [], likes: [], reports: [], createdAt: new Date(), ...p };
  const r = await col('posts').insertOne(doc);
  return { ...doc, _id: r.insertedId };
}

const update = (id, fields) => col('posts').updateOne({ _id: oid(id) }, { $set: fields });

/**
 * Deletes a post and automatically deletes any album if this was the ONLY post inside it.
 */
async function remove(id) {
  const postObjectId = oid(id);

  // 1. Find all albums containing this post
  const albumsWithPost = await col('albums').find({ postIds: postObjectId }).toArray();

  for (const album of albumsWithPost) {
    if (album.postIds.length === 1 && String(album.postIds[0]) === String(postObjectId)) {
      // BONUS FEATURE: If this was the ONLY post in the album, delete the album!
      await col('albums').deleteOne({ _id: album._id });
    } else {
      // Otherwise, just remove the post ID from the album's postIds array
      await col('albums').updateOne({ _id: album._id }, { $pull: { postIds: postObjectId } });
    }
  }

  // 2. Remove reports associated with this post
  await col('reports').deleteMany({ postId: postObjectId });

  // 3. Delete the post itself
  await col('posts').deleteOne({ _id: postObjectId });
}

const toggleLike = (id, userId, liked) =>
  col('posts').updateOne({ _id: oid(id) }, liked ? { $pull: { likes: oid(userId) } } : { $addToSet: { likes: oid(userId) } });

const addComment = (id, comment) =>
  col('posts').updateOne({ _id: oid(id) }, { $push: { comments: comment } });

const removeComment = (id, commentId) =>
  col('posts').updateOne({ _id: oid(id) }, { $pull: { comments: { _id: oid(commentId) } } });

module.exports = { findRaw, find, findById, create, update, remove, toggleLike, addComment, removeComment };