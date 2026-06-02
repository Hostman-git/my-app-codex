import { Activity, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <nav className="topbar auth-topbar">
        <div className="brand">
          <Activity />
          <span>RunMap</span>
        </div>
        <ThemeToggle />
      </nav>

      <section className="auth-layout">
        <div className="auth-copy">
          <p>Run anywhere.</p>
          <h1>Generate safe, interesting routes in seconds.</h1>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <h2>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
          {mode === 'signup' && (
            <label>
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
            </label>
          )}
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type="password" minLength={8} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Working...' : mode === 'signup' ? 'Sign up' : 'Log in'}
            <ArrowRight size={17} />
          </button>
          <p className="auth-switch">
            {mode === 'signup' ? 'Already have an account?' : 'New to RunMap?'}{' '}
            <Link to={mode === 'signup' ? '/login' : '/signup'}>{mode === 'signup' ? 'Log in' : 'Sign up'}</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
