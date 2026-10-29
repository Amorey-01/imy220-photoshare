import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import PageLayout from '../components/PageLayout';
import ProfilePreview from '../components/ProfilePreview';

function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setUsers(await api('/users'));
      setReports(await api('/reports'));
      setReasons(await api('/reasons'));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn) => { try { await fn(); setError(''); } catch (e) { setError(e.message); } };

  const addReason = (e) => {
    e.preventDefault();
    run(async () => { setReasons((await api('/reasons', { method: 'POST', body: { text } }))); setText(''); });
  };
  const removeReason = (id) => run(async () => setReasons(await api(`/reasons/${id}`, { method: 'DELETE' })));
  const dismiss = (id) => run(async () => { await api(`/reports/${id}`, { method: 'DELETE' }); load(); });
  const deletePost = (r) => run(async () => { await api(`/posts/${r.postId}`, { method: 'DELETE' }); load(); });
  const deleteUser = (u) => confirm(`Delete ${u.username}'s account and all their content?`) &&
    run(async () => { await api(`/users/${u._id}`, { method: 'DELETE' }); load(); });

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold">Admin</h1>
      {error && <p className="error">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Reported posts ({reports.length})</h2>
        {reports.length === 0 && <p className="card text-center text-muted">No reports. All quiet.</p>}
        {reports.map((r) => (
          <div key={r._id} className="card flex flex-col gap-4 sm:flex-row sm:items-center">
            {r.post ? <img src={r.post.image} alt="" className="h-24 w-24 rounded-xl object-cover" /> : <div className="h-24 w-24 rounded-xl bg-sand" />}
            <div className="flex-1 space-y-1 text-sm">
              <p><span className="tag">{r.reason}</span> reported by <b>{r.reporter}</b></p>
              {r.details && <p className="text-muted">“{r.details}”</p>}
              {r.post && <p className="text-muted">Post by {r.post.author.username}: {r.post.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {r.post && <Link to={`/post/${r.postId}`} className="btn-ghost">View</Link>}
              {r.post && <button className="btn-danger" onClick={() => deletePost(r)}>Delete post</button>}
              <button className="btn-ghost" onClick={() => dismiss(r._id)}>Dismiss</button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Report reasons</h2>
        <div className="flex flex-wrap gap-2">
          {reasons.map((r) => (
            <span key={r._id} className="tag flex items-center gap-2 !text-sm">
              {r.text}
              <button onClick={() => removeReason(r._id)} aria-label={`Remove ${r.text}`} className="text-muted hover:text-clay">✕</button>
            </span>
          ))}
        </div>
        <form onSubmit={addReason} className="flex gap-2 sm:max-w-md">
          <input className="input" placeholder="New reason…" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn-primary" disabled={!text.trim()}>Add</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Users ({users.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {users.map((u) => (
            <ProfilePreview key={u._id} user={u}>
              {u._id !== user._id && <button className="btn-danger !px-3 !py-1" onClick={() => deleteUser(u)}>Delete</button>}
            </ProfilePreview>
          ))}
        </div>
        <p className="text-sm text-muted">Open a profile to edit it. Admins can also edit or delete any post, comment and album from its page.</p>
      </section>
    </PageLayout>
  );
}

export default AdminPage;
