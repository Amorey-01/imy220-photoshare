import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function SignupForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) return setError('All fields are required.');
    if (!form.email.includes('@')) return setError('Enter a valid email address.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    setBusy(true);
    try {
      await signup({ username: form.username, email: form.email, password: form.password });
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
        <label htmlFor="signupUsername" className="label">Username</label>
        <input id="signupUsername" className="input" value={form.username} onChange={set('username')} />
      </div>
      <div>
        <label htmlFor="signupEmail" className="label">Email</label>
        <input id="signupEmail" type="email" className="input" value={form.email} onChange={set('email')} />
      </div>
      <div>
        <label htmlFor="signupPassword" className="label">Password</label>
        <input id="signupPassword" type="password" className="input" value={form.password} onChange={set('password')} />
      </div>
      <div>
        <label htmlFor="signupConfirmPassword" className="label">Confirm Password</label>
        <input id="signupConfirmPassword" type="password" className="input" value={form.confirm} onChange={set('confirm')} />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Sign Up'}</button>
    </form>
  );
}

export default SignupForm;
