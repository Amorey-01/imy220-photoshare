import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

function SplashPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState('login');
  if (!loading && user) return <Navigate to="/home" replace />;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-clay px-10 py-16 text-cream lg:px-20">
        <div className="mb-8 h-16 w-16 rounded-xl border-4 border-cream" />
        <h1 className="font-display text-6xl font-bold !text-cream">GallerSketch</h1>
        <p className="mt-4 max-w-sm text-xl text-cream/90">Where your art finds its frame. Share your work, collect it in albums and follow the people you admire.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex rounded-full bg-sand p-1">
            {['login', 'signup'].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${mode === m ? 'bg-white shadow text-ink' : 'text-muted'}`}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>
          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}

export default SplashPage;
