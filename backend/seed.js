// Seeds the database on first start (only when there are no users yet).
const bcrypt = require('bcryptjs');
const { connect, col, ObjectId } = require('./db');

const svg = (a, b, shapes) =>
  'data:image/svg+xml;base64,' + Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/>${shapes}</svg>`
  ).toString('base64');

const IMAGES = {
  sunset: svg('#f6b26b', '#c2543a', '<circle cx="400" cy="460" r="170" fill="#fff3d6" opacity=".9"/><rect y="520" width="800" height="280" fill="#3b2a2a"/><path d="M0 560 Q200 500 400 560 T800 540 V800 H0Z" fill="#241919"/>'),
  hills: svg('#cfe3d0', '#6f8f72', '<path d="M0 520 Q200 300 400 480 T800 400 V800 H0Z" fill="#4f6e55"/><path d="M0 640 Q250 480 500 620 T800 580 V800 H0Z" fill="#35503c"/><circle cx="620" cy="190" r="70" fill="#fffbe8"/>'),
  waves: svg('#bcd7ea', '#2f5d80', '<path d="M0 420 Q100 360 200 420 T400 420 T600 420 T800 420 V800 H0Z" fill="#2f5d80" opacity=".7"/><path d="M0 520 Q100 460 200 520 T400 520 T600 520 T800 520 V800 H0Z" fill="#1e405c" opacity=".8"/><path d="M0 640 Q100 580 200 640 T400 640 T600 640 T800 640 V800 H0Z" fill="#12293b"/>'),
  blossom: svg('#f7d6dc', '#d9788d', '<g fill="#fff0f2" opacity=".95"><circle cx="400" cy="400" r="60"/><circle cx="400" cy="280" r="80"/><circle cx="400" cy="520" r="80"/><circle cx="280" cy="400" r="80"/><circle cx="520" cy="400" r="80"/></g><circle cx="400" cy="400" r="40" fill="#e0a830"/>'),
  urban: svg('#e8dff5', '#ce93d8', '<rect x="200" y="300" width="400" height="400" fill="#ab47bc"/><circle cx="400" cy="200" r="80" fill="#fff"/>'),
  portrait: svg('#ffecb3', '#ffa000', '<circle cx="400" cy="400" r="200" fill="#ffe082"/>'),
  abstract: svg('#b2dfdb', '#00796b', '<path d="M100 100 L700 700 M700 100 L100 700" stroke="#fff" stroke-width="40"/>'),
  night: svg('#37474f', '#263238', '<circle cx="600" cy="200" r="50" fill="#eceff1"/>'),
};

const avatar = (c) => svg(c, '#2b2623', '<circle cx="400" cy="320" r="130" fill="#faf6ef" opacity=".9"/><path d="M150 760 Q400 400 650 760Z" fill="#faf6ef" opacity=".9"/>');

async function seed({ reset = false } = {}) {
  if (reset) await Promise.all(['users', 'posts', 'albums', 'friendRequests', 'reasons', 'reports'].map((c) => col(c).deleteMany({})));
  if (await col('users').countDocuments()) return;

  const hash = await bcrypt.hash('password123', 10);
  const base = { friends: [], isAdmin: false, createdAt: new Date() };
  const mk = (username, name, bio, color, extra = {}) =>
    ({ ...base, username, name, email: `${username}@frame.test`, passwordHash: hash, bio, profilePic: avatar(color), ...extra });

  // 8 registered users
  const { insertedIds: u } = await col('users').insertMany([
    mk('keisha_art', 'Keisha', 'Illustrator sharing sketches and studies.', '#c2543a'),
    mk('another_artist', 'Another Artist', 'Watercolours and natural landscapes.', '#7a8f7a'),
    mk('sketchbook_sam', 'Sam', 'Just here for ink sketchbooks.', '#6b8fb0'),
    mk('chloe_design', 'Chloe', 'Graphic design and digital typography.', '#ab47bc'),
    mk('liam_photo', 'Liam', 'Urban photography and night lights.', '#ffa000'),
    mk('maya_craft', 'Maya', 'Abstract canvases and textures.', '#00796b'),
    mk('noah_dev', 'Noah', 'Coder creating generative art.', '#37474f'),
    mk('admin', 'GallerSketch Admin', 'Keeping the gallery safe and clean.', '#2b2623', { isAdmin: true }),
  ]);

  // Set up friendships
  await col('users').updateOne({ _id: u[0] }, { $set: { friends: [u[1], u[2], u[3]] } });
  await col('users').updateOne({ _id: u[1] }, { $set: { friends: [u[0], u[2]] } });
  await col('users').updateOne({ _id: u[2] }, { $set: { friends: [u[0], u[1]] } });
  await col('users').updateOne({ _id: u[3] }, { $set: { friends: [u[0]] } });

  const day = 86400000;
  const post = (author, image, description, hashtags, ago) =>
    ({ authorId: author, image, description, hashtags, comments: [], likes: [], reports: [], createdAt: new Date(Date.now() - ago * day) });

  // 10+ posts
  const { insertedIds: p } = await col('posts').insertMany([
    post(u[0], IMAGES.sunset, 'A quick sketch of last night sunset', ['sketch', 'sunset', 'art'], 9),
    post(u[1], IMAGES.hills, 'Watercolour study of the rolling hills', ['watercolour', 'landscape'], 8),
    post(u[2], IMAGES.waves, 'Practising waves with black ink', ['ink', 'sea'], 7),
    post(u[0], IMAGES.blossom, 'Spring blossom study, digital vector', ['digital', 'spring', 'art'], 6),
    post(u[3], IMAGES.urban, 'Typography poster layout experiment', ['typography', 'design', 'poster'], 5),
    post(u[4], IMAGES.portrait, 'Golden hour portrait session', ['photography', 'portrait', 'light'], 4),
    post(u[5], IMAGES.abstract, 'Acrylic texture experimentation #1', ['abstract', 'acrylic', 'texture'], 3),
    post(u[6], IMAGES.night, 'Code-generated procedural starfield', ['generative', 'code', 'art'], 2),
    post(u[1], IMAGES.sunset, 'Another evening view from the valley', ['landscape', 'sunset'], 1.5),
    post(u[2], IMAGES.hills, 'Morning walk inspiration', ['sketch', 'nature'], 1),
  ]);

  await col('posts').updateOne({ _id: p[0] }, {
    $set: { likes: [u[1], u[2]], comments: [
      { _id: new ObjectId(), userId: u[1], text: 'Love this color palette!', createdAt: new Date() },
      { _id: new ObjectId(), userId: u[2], text: 'Great atmosphere', createdAt: new Date() },
    ] },
  });

  await col('albums').insertMany([
    { ownerId: u[0], name: 'Sketchbook 2026', description: 'My favorite digital and traditional sketches.', hashtags: ['sketch', 'art'], postIds: [p[0], p[3]], createdAt: new Date() },
    { ownerId: u[1], name: 'Landscapes', description: 'Hills, rivers and skies.', hashtags: ['landscape'], postIds: [p[1], p[8]], createdAt: new Date() },
    { ownerId: u[3], name: 'Design Works', description: 'Posters and typography.', hashtags: ['design'], postIds: [p[4]], createdAt: new Date() },
  ]);

  await col('reasons').insertMany(['Spam', 'Inappropriate content', 'Harassment', 'Copyright infringement']
    .map((text) => ({ text, createdAt: new Date() })));

  console.log('Database seeded.');
}

module.exports = { seed };

if (require.main === module) {
  connect().then(() => seed({ reset: process.argv.includes('--reset') })).then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
}