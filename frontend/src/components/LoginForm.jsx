import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return setError('Both fields are required.');
    if (!email.includes('@')) return setError('Enter a valid email address.');
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="loginEmail" className="label">Email</label>
        <input id="loginEmail" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="loginPassword" className="label">Password</label>
        <input id="loginPassword" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log In'}</button>
    </form>
  );
}

export default LoginForm;
