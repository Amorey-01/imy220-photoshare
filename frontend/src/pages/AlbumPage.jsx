import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import PageLayout from '../components/PageLayout';
import AlbumForm from '../components/AlbumForm';
import Feed from '../components/Feed';

function AlbumPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [mine, setMine] = useState([]);
  const [editing, setEditing] = useState(false);
  const [pick, setPick] = useState('');
  const [error, setError] = useState('');

  const canManage = album && (user.isAdmin || String(album.ownerId) === user._id);

  useEffect(() => {
    api(`/albums/${id}`).then(setAlbum).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (canManage) api(`/posts?userId=${album.ownerId}`).then(setMine).catch(() => {});
  }, [canManage, album?.ownerId]);

  async function change(path, method, body) {
    try { setAlbum(await api(`/albums/${id}${path}`, { method, body })); setError(''); setPick(''); } catch (e) { setError(e.message); }
  }
  async function remove() {
    if (!confirm('Delete this album? Its posts will not be deleted.')) return;
    try { await api(`/albums/${id}`, { method: 'DELETE' }); navigate(`/profile/${album.ownerId}`); } catch (e) { setError(e.message); }
  }

  if (!album) return <PageLayout>{error ? <p className="error">{error}</p> : <p className="text-muted">Loading…</p>}</PageLayout>;

  const available = mine.filter((p) => !album.postIds.some((pid) => String(pid) === String(p._id)));

  return (
    <PageLayout>
      {error && <p className="error">{error}</p>}
      {editing ? (
        <AlbumForm album={album} onCancel={() => setEditing(false)} onSaved={(a) => { setAlbum(a); setEditing(false); }} />
      ) : (
        <header className="card space-y-3">
          <Link to={`/profile/${album.ownerId}`} className="text-sm text-clay hover:underline">← Back to profile</Link>
          <h1 className="text-4xl font-bold">{album.name}</h1>
          {album.description && <p className="text-muted">{album.description}</p>}
          <div className="flex flex-wrap gap-1">{album.hashtags.map((t) => <span key={t} className="tag">#{t}</span>)}</div>
          {canManage && (
            <div className="flex gap-2 pt-2">
              <button className="btn-ghost" onClick={() => setEditing(true)}>Edit album</button>
              <button className="btn-danger" onClick={remove}>Delete album</button>
            </div>
          )}
        </header>
      )}

      {canManage && (
        <div className="flex gap-2 sm:max-w-md">
          <select className="input" value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Post to add">
            <option value="">Add one of your posts…</option>
            {available.map((p) => <option key={p._id} value={p._id}>{p.description.slice(0, 40) || 'Untitled post'}</option>)}
          </select>
          <button className="btn-sage" disabled={!pick} onClick={() => change('/posts', 'POST', { postId: pick })}>Add</button>
        </div>
      )}

      {album.posts.length === 0 ? <p className="card text-center text-muted">This album is empty.</p> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {album.posts.map((p) => (
            <div key={p._id} className="space-y-2">
              <Feed posts={[p]} />
              {canManage && <button className="btn-ghost w-full" onClick={() => change(`/posts/${p._id}`, 'DELETE')}>Remove from album</button>}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default AlbumPage;
