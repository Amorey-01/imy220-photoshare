import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import AlbumPage from './pages/AlbumPage';
import AdminPage from './pages/AdminPage';

function Protected({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-10 text-center text-muted">Loading…</p>;
  if (!user) return <Navigate to="/" replace />;
  if (admin && !user.isAdmin) return <Navigate to="/home" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<Protected><HomePage /></Protected>} />
          <Route path="/profile/:id" element={<Protected><ProfilePage /></Protected>} />
          <Route path="/post/:id" element={<Protected><PostPage /></Protected>} />
          <Route path="/album/:id" element={<Protected><AlbumPage /></Protected>} />
          <Route path="/admin" element={<Protected admin><AdminPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
