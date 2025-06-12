import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const linkStyle = isActive => ({
    color: isActive ? '#4f8cff' : '#fff',
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    fontSize: '1.1rem',
    background: isActive ? '#e3f0ff' : 'transparent',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    transition: 'background 0.2s, color 0.2s'
  });
  return (
    <nav style={{ background: '#4f5d75', boxShadow: '0 2px 16px #b5ead733', padding: '1.1rem 0.5rem', borderRadius: 0, marginBottom: 32, width: '100%', maxWidth: '100vw', minWidth: 0, overflow: 'hidden', position: 'relative' }}>
      <div className="navbar-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
        <span className="navbar-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 900, fontSize: '2.1rem', color: '#ffb347', letterSpacing: 2, fontFamily: 'Montserrat, sans-serif', textShadow: '0 2px 8px #fff7', lineHeight: 1.1, minWidth: 120 }}>
          <span>Budget Friend</span>
          <span role="img" aria-label="handshake" style={{ fontSize: 28, marginTop: 2 }}>🤝</span>
        </span>
        <div className="navbar-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ ...linkStyle(location.pathname === '/'), marginBottom: 8, minWidth: 90, textAlign: 'center' }}>Dashboard</Link>
          <Link to="/transactions" style={{ ...linkStyle(location.pathname.startsWith('/transactions')), marginBottom: 8, minWidth: 90, textAlign: 'center' }}>Transactions</Link>
          <Link to="/reports" style={{ ...linkStyle(location.pathname.startsWith('/reports')), marginBottom: 8, minWidth: 90, textAlign: 'center' }}>Reports</Link>
          <Link to="/filter" style={{ ...linkStyle(location.pathname.startsWith('/filter')), marginBottom: 8, minWidth: 90, textAlign: 'center' }}>Filter</Link>
          {user && (
            <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '2rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#fff', color: '#4f8cff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                {user.email?.[0]?.toUpperCase() || 'U'}
              </span>
              <span style={{ color: '#fff', fontWeight: 500, fontSize: 14, wordBreak: 'break-all' }}>{user.email}</span>
              <button onClick={onLogout} style={{ background: 'none', border: '1px solid #fff', color: '#fff', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 500, cursor: 'pointer', marginLeft: 8, marginBottom: 8, fontSize: 14 }}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .navbar-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.7rem !important;
            padding: 0 0.2rem !important;
          }
          .navbar-title {
            font-size: 1.3rem !important;
            min-width: 0 !important;
          }
          .navbar-title span[role="img"] {
            font-size: 22px !important;
          }
          .navbar-links {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: stretch !important;
          }
          .navbar-links a {
            font-size: 1rem !important;
            min-width: 70px !important;
            padding: 0.4rem 0.7rem !important;
            margin-bottom: 0 !important;
          }
          .navbar-user {
            flex-direction: column !important;
            align-items: flex-start !important;
            margin-left: 0 !important;
            gap: 0.3rem !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
