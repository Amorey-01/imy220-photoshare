import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import Avatar from './Avatar';

function Comments({ post, onChange }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function add(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      onChange(await api(`/posts/${post._id}/comments`, { method: 'POST', body: { text } }));
      setText(''); setError('');
    } catch (err) { setError(err.message); }
  }

  async function remove(id) {
    try { onChange(await api(`/posts/${post._id}/comments/${id}`, { method: 'DELETE' })); } catch (err) { setError(err.message); }
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Comments ({post.comments.length})</h3>
      {error && <p className="error">{error}</p>}
      <ul className="space-y-3">
        {post.comments.map((c) => {
          const mine = String(c.userId) === String(user._id) || String(post.authorId) === String(user._id) || user.isAdmin;
          return (
            <li key={c._id} className="flex gap-3">
              <Avatar user={c.author} size="sm" />
              <div className="flex-1 rounded-2xl bg-sand/60 px-4 py-2">
                <Link to={`/profile/${c.userId}`} className="text-sm font-semibold">{c.author.username}</Link>
                <p className="text-sm">{c.text}</p>
              </div>
              {mine && <button onClick={() => remove(c._id)} className="text-xs text-muted hover:text-clay" aria-label="Delete comment">✕</button>}
            </li>
          );
        })}
      </ul>
      <form onSubmit={add} className="flex gap-2">
        <input className="input" placeholder="Add a comment…" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn-primary">Send</button>
      </form>
    </section>
  );
}

export default Comments;
