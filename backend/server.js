const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Stubbed sign-in endpoint
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  res.json({
    success: true,
    user: {
      id: 1,
      username: 'keisha_art',
      email: email || 'test@test.com',
    },
  });
});

// Stubbed sign-up endpoint
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  res.json({
    success: true,
    user: {
      id: 2,
      username: username || 'new_user',

      email: email || 'new_user@test.com',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});