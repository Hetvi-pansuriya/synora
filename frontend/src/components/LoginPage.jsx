import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Invalid username or password');
      localStorage.setItem('synora_user', JSON.stringify({ name: data.name, username: data.username }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-wordmark"><span>S</span>ynora</div>
          <p>A focused workspace for profile review and introductions.</p>
          <div className="login-features">
            {['Compatibility scorecards', 'Profile follow-up tracking', 'Introduction email drafts'].map((item) => (
              <div className="login-feature" key={item}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 4 4 8-8" /></svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-footer">Synora · Team Workspace</div>
      </section>
      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <p>Sign in to your matchmaker account</p>
          <div className="login-fields">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
            </div>
          </div>
          <button className="login-submit" type="submit" disabled={loading}>
            {loading && <span className="login-spinner" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <div className="login-error">{error}</div>}
          <div className="login-demo">Demo credentials: matchmaker / tdc123</div>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
