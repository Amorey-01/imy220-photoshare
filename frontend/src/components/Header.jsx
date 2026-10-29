import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import SearchInput from './SearchInput';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dark mode state initialization
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  function handleSearch(query) {
    if (query.trim()) {
      navigate(`/home?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-sandDark/70 bg-sand/90 backdrop-blur transition-colors dark:bg-stone-900/90 dark:border-stone-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/home" className="text-xl font-bold tracking-tight text-charcoal dark:text-stone-100 hover:opacity-80 transition">
          GallerSketch
        </Link>

        {user && (
          <div className="flex-1 max-w-md mx-4">
            <SearchInput onSearch={handleSearch} placeholder="Search users, posts, or albums…" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDark(!dark)}
            className="rounded-xl border border-sandDark/80 px-3 py-1.5 text-xs font-semibold text-charcoal dark:text-stone-200 dark:border-stone-700 hover:bg-sandDark/20 dark:hover:bg-stone-800 transition"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>

          {user ? (
            <>
              <Link
                to={`/profile/${user._id}`}
                className="btn-ghost text-sm font-medium"
              >
                Profile
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-xl bg-clay/10 px-3 py-1.5 text-xs font-semibold text-clay hover:bg-clay/20 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="btn-ghost text-sm text-muted hover:text-clay"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="btn-primary text-sm">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;