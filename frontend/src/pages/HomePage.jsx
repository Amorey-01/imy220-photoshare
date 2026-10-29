import { useEffect, useState } from 'react';
import { api } from '../api';
import PageLayout from '../components/PageLayout';
import Feed from '../components/Feed';
import SearchInput from '../components/SearchInput';
import ProfilePreview from '../components/ProfilePreview';
import CreatePost from '../components/CreatePost';

function HomePage() {
  const [feed, setFeed] = useState('local');
  const [q, setQ] = useState('');
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const query = new URLSearchParams({ feed, ...(q && { q }) });
        setPosts(await api(`/posts?${query}`));
        setPeople(q ? await api(`/users?q=${encodeURIComponent(q)}`) : []);
        setError('');
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    }, 250); // debounce typing in the search box
    return () => clearTimeout(t);
  }, [feed, q]);

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full bg-sand p-1">
          {[['local', 'Friends'], ['global', 'Everyone']].map(([key, label]) => (
            <button key={key} onClick={() => setFeed(key)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${feed === key ? 'bg-clay text-cream' : 'text-muted hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>
        <SearchInput value={q} onChange={setQ} />
        <button className="btn-sage" onClick={() => setCreating(!creating)}>{creating ? 'Close' : '+ New post'}</button>
      </div>

      {creating && <CreatePost onCreated={(p) => { setPosts([p, ...posts]); setCreating(false); }} />}
      {error && <p className="error">{error}</p>}

      {people.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold">People</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((u) => <ProfilePreview key={u._id} user={u} />)}
          </div>
        </section>
      )}

      <h2 className="text-2xl font-semibold">{feed === 'local' ? 'From you and your friends' : 'Across GallerSketch'}{q && ` · “${q}”`}</h2>
      {loading ? <p className="text-muted">Loading…</p> : (
        <Feed posts={posts} empty={feed === 'local' && !q ? 'No posts yet. Add some friends or switch to Everyone.' : 'No posts found.'} />
      )}
    </PageLayout>
  );
}

export default HomePage;
