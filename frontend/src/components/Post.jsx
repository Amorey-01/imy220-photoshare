import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import Image from './Image';
import Avatar from './Avatar';
import Comments from './Comments';
import EditPost from './EditPost';
import ReportForm from './ReportForm';

function Post({ post, onChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'edit' | 'report' | null
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [myAlbums, setMyAlbums] = useState([]);
  const [albumId, setAlbumId] = useState('');

  const isOwner = String(post.authorId) === String(user._id);
  const canManage = isOwner || user.isAdmin;
  const liked = post.likes.some((l) => String(l) === String(user._id));

  useEffect(() => {
    if (isOwner) api(`/albums?ownerId=${user._id}`).then(setMyAlbums).catch(() => {});
  }, [isOwner, user._id]);

  async function like() {
    try { onChange(await api(`/posts/${post._id}/like`, { method: 'POST' })); } catch (e) { setError(e.message); }
  }
  async function remove() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api(`/posts/${post._id}`, { method: 'DELETE' });
      navigate(`/profile/${post.authorId}`);
    } catch (e) { setError(e.message); }
  }
  async function addToAlbum() {
    if (!albumId) return;
    try {
      await api(`/albums/${albumId}/posts`, { method: 'POST', body: { postId: post._id } });
      setNotice('Added to album.'); setAlbumId('');
    } catch (e) { setError(e.message); }
  }

  return (
    <article className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-sandDark/70 bg-sand">
        <Image src={post.image} alt={post.description} className="w-full object-cover" />
      </div>

      <div className="space-y-5">
        <Link to={`/profile/${post.author._id}`} className="flex items-center gap-3">
          <Avatar user={post.author} />
          <div>
            <p className="font-semibold">{post.author.username}</p>
            <p className="text-xs text-muted">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </Link>

        {mode === 'edit' ? (
          <EditPost post={post} onCancel={() => setMode(null)} onSaved={(p) => { onChange(p); setMode(null); }} />
        ) : (
          <>
            <p className="text-lg">{post.description}</p>
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
          </>
        )}

        {notice && <p className="rounded-xl bg-sage/15 px-4 py-2 text-sm text-sageDark">{notice}</p>}
        {error && <p className="error">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <button onClick={like} className={liked ? 'btn-primary' : 'btn-ghost'}>♥ {post.likes.length}</button>
          {canManage && mode !== 'edit' && <button onClick={() => setMode('edit')} className="btn-ghost">Edit</button>}
          {canManage && <button onClick={remove} className="btn-danger">Delete</button>}
          {!isOwner && <button onClick={() => setMode('report')} className="btn-ghost">Report</button>}
        </div>

        {mode === 'report' && <ReportForm postId={post._id} onDone={(msg) => { setMode(null); if (msg) setNotice(msg); }} />}

        {isOwner && myAlbums.length > 0 && (
          <div className="flex gap-2">
            <select className="input" value={albumId} onChange={(e) => setAlbumId(e.target.value)} aria-label="Album">
              <option value="">Add to album…</option>
              {myAlbums.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
            <button onClick={addToAlbum} className="btn-sage" disabled={!albumId}>Add</button>
          </div>
        )}

        <hr className="border-sandDark/70" />
        <Comments post={post} onChange={onChange} />
      </div>
    </article>
  );
}

export default Post;
