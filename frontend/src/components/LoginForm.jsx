import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValid = email.includes('@') && password.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Sign-in response:', data);
    } catch (err) {
      console.error('Sign-in request failed:', err);
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log In</h3>
      {error && <p>{error}</p>}

      <label htmlFor="loginEmail">Email</label>
      <input
        id="loginEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="loginPassword">Password</label>
      <input
        id="loginPassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={!isValid}>Log In</button>
    </form>
  );
}

export default LoginForm;