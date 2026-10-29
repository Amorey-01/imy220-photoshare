const { col } = require('../db');

// friend requests ------------------------------------------------------
const findRequest = (from, to) => col('friendRequests').findOne({ from, to });
const createRequest = (from, to) => col('friendRequests').insertOne({ from, to, createdAt: new Date() });
const deleteRequest = (from, to) => col('friendRequests').deleteOne({ from, to });
const incoming = (to) => col('friendRequests').find({ to }).toArray();
const outgoing = (from) => col('friendRequests').find({ from }).toArray();

// moderation: reasons + reports ---------------------------------------
const reasons = {
  all: () => col('reasons').find().sort({ text: 1 }).toArray(),
  find: (id) => col('reasons').findOne({ _id: id }),
  create: async (text) => (await col('reasons').insertOne({ text, createdAt: new Date() })).insertedId,
  remove: (id) => col('reasons').deleteOne({ _id: id }),
};
const reports = {
  create: (r) => col('reports').insertOne({ ...r, createdAt: new Date() }),
  exists: (postId, reporterId) => col('reports').findOne({ postId, reporterId }),
  all: () => col('reports').find().sort({ createdAt: -1 }).toArray(),
  remove: (id) => col('reports').deleteOne({ _id: id }),
};

module.exports = { findRequest, createRequest, deleteRequest, incoming, outgoing, reasons, reports };
