import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './App.css'
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import Filter from './components/Filter';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Reports from './Reports';
import Login from './Login';
import FilterPage from './FilterPage';

function App() {
  const [user, setUser] = useState(() => {
    // For demo, use localStorage to persist login
    return JSON.parse(localStorage.getItem('user') || 'null');
  });

  const handleLogin = (userObj = { email: 'demo@user.com' }) => {
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace /> }>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="filter" element={<FilterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
