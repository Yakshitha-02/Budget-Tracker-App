import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function Layout({ user, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ padding: '2rem', background: '#f6f8fa' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
