const { col } = require('../db');

const PUBLIC = { passwordHash: 0, email: 0 };

const create = async (u) => {
  const doc = { bio: '', profilePic: '', friends: [], isAdmin: false, createdAt: new Date(), ...u };
  const r = await col('users').insertOne(doc);
  return { ...doc, _id: r.insertedId };
};
const findById = (id, projection = {}) => col('users').findOne({ _id: id }, { projection });
const findByEmail = (email) => col('users').findOne({ email: email.toLowerCase() });
const findByUsername = (username) =>
  col('users').findOne({ username: { $regex: `^${escapeRe(username)}$`, $options: 'i' } });
const findMany = (ids, projection = PUBLIC) => col('users').find({ _id: { $in: ids } }, { projection }).toArray();
const search = (q) => {
  const filter = q ? {
    $or: [
      { username: { $regex: escapeRe(q), $options: 'i' } },
      { name: { $regex: escapeRe(q), $options: 'i' } },
      { email: { $regex: escapeRe(q), $options: 'i' } }
    ]
  } : {};
  return col('users').find(filter, { projection: PUBLIC }).sort({ username: 1 }).limit(50).toArray();
};
const update = (id, fields) => col('users').updateOne({ _id: id }, { $set: fields });
const addFriend = (a, b) => col('users').updateOne({ _id: a }, { $addToSet: { friends: b } });
const removeFriend = (a, b) => col('users').updateOne({ _id: a }, { $pull: { friends: b } });

async function remove(id) {
  const posts = await col('posts').find({ authorId: id }, { projection: { _id: 1 } }).toArray();
  const postIds = posts.map((p) => p._id);
  await col('posts').deleteMany({ authorId: id });
  await col('albums').updateMany({}, { $pull: { postIds: { $in: postIds } } });
  await col('albums').deleteMany({ ownerId: id });
  await col('posts').updateMany({}, { $pull: { comments: { userId: id }, likes: id } });
  await col('reports').deleteMany({ $or: [{ reporterId: id }, { postId: { $in: postIds } }] });
  await col('friendRequests').deleteMany({ $or: [{ from: id }, { to: id }] });
  await col('users').updateMany({}, { $pull: { friends: id } });
  await col('users').deleteOne({ _id: id });
}

function escapeRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

module.exports = { create, findById, findByEmail, findByUsername, findMany, search, update, addFriend, removeFriend, remove, escapeRe, PUBLIC };