import { useState } from 'react';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isValid =
    username.length > 0 &&
    email.includes('@') &&
    password.length > 0 &&
    password === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {

      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log('Sign-up response:', data);
    } catch (err) {
      console.error('Sign-up request failed:', err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      {error && <p>{error}</p>}

      <label htmlFor="signupUsername">Username</label>
      <input
        id="signupUsername"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="signupEmail">Email</label>
      <input
        id="signupEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


      <label htmlFor="signupPassword">Password</label>
      <input
        id="signupPassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="signupConfirmPassword">Confirm Password</label>
      <input
        id="signupConfirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button type="submit" disabled={!isValid}>Sign Up</button>
    </form>
  );
}

export default SignupForm;