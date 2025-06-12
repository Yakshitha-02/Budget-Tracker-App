import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(() => {
    // Demo: check if a user is saved in localStorage
    return !!localStorage.getItem('userAccount');
  });
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('userAccount') || '{}');
      if (saved.email === email && saved.password === password) {
        setError('');
        setLoading(false);
        if (onLogin) onLogin({ email });
        navigate('/');
      } else {
        setError('Invalid email or password.');
        setLoading(false);
      }
    }, 800);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('userAccount', JSON.stringify({ email, password }));
      setHasAccount(true);
      setShowCreate(false);
      setError('Account created! Please log in.');
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fa' }}>
      <form onSubmit={showCreate ? handleCreateAccount : handleLogin} style={{ background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#4f8cff' }}>{showCreate ? 'Create Account' : 'Login'}</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
            autoComplete="username"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
            autoComplete="current-password"
          />
        </div>
        {error && <div style={{ color: '#c62828', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#4f8cff', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginBottom: 12 }}>
          {loading ? (showCreate ? 'Creating...' : 'Logging in...') : (showCreate ? 'Create Account' : 'Login')}
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <a href="#" style={{ color: '#4f8cff', textDecoration: 'none' }}>Forgot Password?</a>
          {hasAccount && !showCreate && (
            <a href="#" style={{ color: '#4f8cff', textDecoration: 'none' }} onClick={e => { e.preventDefault(); setShowCreate(true); }}>Create Account</a>
          )}
          {!hasAccount && !showCreate && (
            <span style={{ color: '#4f8cff' }}>No account? <a href="#" style={{ color: '#4f8cff', textDecoration: 'underline' }} onClick={e => { e.preventDefault(); setShowCreate(true); }}>Create one</a></span>
          )}
          {showCreate && (
            <a href="#" style={{ color: '#4f8cff', textDecoration: 'none' }} onClick={e => { e.preventDefault(); setShowCreate(false); }}>Back to Login</a>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
