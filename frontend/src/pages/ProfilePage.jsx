import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import PageLayout from '../components/PageLayout';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import FriendButton from '../components/FriendButton';
import AlbumCard from '../components/AlbumCard';
import AlbumForm from '../components/AlbumForm';
import ProfilePreview from '../components/ProfilePreview';

function ProfilePage() {
  const { id } = useParams();
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('posts');
  const [panel, setPanel] = useState(null); // 'edit' | 'post' | 'album'
  const [error, setError] = useState('');

  const isSelf = user._id === id;
  const canManage = isSelf || user.isAdmin;

  const load = useCallback(async () => {
    try {
      setProfile(await api(`/users/${id}`));
      setPosts(await api(`/posts?userId=${id}`));
      setAlbums(await api(`/albums?ownerId=${id}`));
      setRequests(user._id === id ? await api('/friends/requests') : []);
      setError('');
    } catch (e) { setError(e.message); }
  }, [id, user._id]);

  useEffect(() => { setProfile(null); setPanel(null); load(); }, [load]);

  async function respond(uid, accept) {
    try {
      await api(`/friends/${accept ? 'accept' : 'decline'}/${uid}`, { method: 'POST' });
      load();
    } catch (e) { setError(e.message); }
  }

  async function deleteProfile() {
    const msg = isSelf ? 'Delete your account and everything you posted? This cannot be undone.' : `Delete ${profile.username}'s account?`;
    if (!confirm(msg)) return;
    try {
      await api(`/users/${id}`, { method: 'DELETE' });
      if (isSelf) { await logout(); navigate('/'); } else navigate('/admin');
    } catch (e) { setError(e.message); }
  }

  if (error && !profile) return <PageLayout><p className="error">{error}</p></PageLayout>;
  if (!profile) return <PageLayout><p className="text-muted">Loading…</p></PageLayout>;

  const actions = (
    <div className="flex flex-wrap gap-2">
      {!isSelf && <FriendButton userId={id} status={profile.friendStatus} onChange={load} />}
      {canManage && <button className="btn-ghost" onClick={() => setPanel(panel === 'edit' ? null : 'edit')}>Edit profile</button>}
      {canManage && <button className="btn-danger" onClick={deleteProfile}>Delete profile</button>}
    </div>
  );

  return (
    <PageLayout>
      {error && <p className="error">{error}</p>}
      <Profile profile={profile} actions={actions} />

      {panel === 'edit' && (
        <EditProfile user={profile} onCancel={() => setPanel(null)}
          onSaved={(u) => { setPanel(null); if (isSelf) setUser({ ...user, ...u }); load(); }} />
      )}

      {isSelf && requests.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Friend requests</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {requests.map((r) => (
              <ProfilePreview key={r._id} user={r}>
                <button className="btn-sage !px-3 !py-1" onClick={() => respond(r._id, true)}>Accept</button>
                <button className="btn-ghost !px-3 !py-1" onClick={() => respond(r._id, false)}>Decline</button>
              </ProfilePreview>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-sand p-1">
          {[['posts', `Posts (${posts.length})`], ['albums', `Albums (${albums.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${tab === key ? 'bg-clay text-cream' : 'text-muted hover:text-ink'}`}>{label}</button>
          ))}
        </div>
        {isSelf && tab === 'posts' && <button className="btn-sage ml-auto" onClick={() => setPanel(panel === 'post' ? null : 'post')}>+ New post</button>}
        {isSelf && tab === 'albums' && <button className="btn-sage ml-auto" onClick={() => setPanel(panel === 'album' ? null : 'album')}>+ New album</button>}
      </div>

      {panel === 'post' && <CreatePost onCreated={() => { setPanel(null); load(); }} />}
      {panel === 'album' && <AlbumForm onCancel={() => setPanel(null)} onSaved={() => { setPanel(null); load(); }} />}

      {tab === 'posts' && <Feed posts={posts} empty="No posts yet." />}
      {tab === 'albums' && (
        albums.length === 0
          ? <p className="card text-center text-muted">No albums yet.</p>
          : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{albums.map((a) => <AlbumCard key={a._id} album={a} />)}</div>
      )}
    </PageLayout>
  );
}

export default ProfilePage;
