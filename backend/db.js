const { MongoClient, ObjectId } = require('mongodb');

let db;

async function connect() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set (see backend/.env.example)');
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME || 'frame');
  return db;
}

const col = (name) => db.collection(name);
const isId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
const oid = (id) => (id instanceof ObjectId ? id : isId(id) ? new ObjectId(id) : null);

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

// "#Sketch, art" -> ['sketch', 'art']
function parseTags(input) {
  const list = Array.isArray(input) ? input : String(input || '').split(/[\s,]+/);
  return [...new Set(list.map((t) => String(t).replace(/^#+/, '').trim().toLowerCase()).filter(Boolean))];
}

module.exports = { connect, col, oid, isId, httpError, parseTags, ObjectId };
