import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';

function Transactions() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
  });
  const [filtered, setFiltered] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAdd = (tx) => {
    setTransactions(prev => [tx, ...prev]);
    setFiltered([]); // reset filter on add
  };

  const handleFilter = ({ category, date }) => {
    let filteredTx = transactions;
    if (category) filteredTx = filteredTx.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    if (date) filteredTx = filteredTx.filter(t => t.date === date);
    setFiltered(filteredTx);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setFiltered(f => f.filter(t => t.id !== id));
  };

  const handleEdit = (tx) => {
    setEditId(tx.id);
    setEditData(tx);
  };

  const handleUpdate = (updatedTx) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    setEditId(null);
    setEditData(null);
    setFiltered([]);
  };

  // Enhanced filtering and sorting
  let txToShow = filtered.length ? filtered : transactions;
  if (search) {
    txToShow = txToShow.filter(t =>
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (sortBy === 'date-desc') txToShow = [...txToShow].sort((a, b) => b.date.localeCompare(a.date));
  if (sortBy === 'date-asc') txToShow = [...txToShow].sort((a, b) => a.date.localeCompare(b.date));
  if (sortBy === 'amount-desc') txToShow = [...txToShow].sort((a, b) => b.amount - a.amount);
  if (sortBy === 'amount-asc') txToShow = [...txToShow].sort((a, b) => a.amount - b.amount);
  if (sortBy === 'category') txToShow = [...txToShow].sort((a, b) => a.category.localeCompare(b.category));

  // CSV Export
  const exportCSV = () => {
    if (!txToShow.length) return;
    const rows = [Object.keys(txToShow[0]).join(',')];
    txToShow.forEach(t => {
      rows.push(Object.values(t).join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 950, margin: '2.5rem auto', padding: '2rem', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(180,180,255,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2.2rem', marginBottom: '2rem', color: '#7b8fa3', letterSpacing: 1 }}>Transactions</h2>
      <Summary transactions={txToShow} />
      <TransactionForm onAdd={handleAdd} allowDateInput />
      {/* New Features UI */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', margin: '1.5rem 0 0.5rem 0', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search by description or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #e0d7ec', minWidth: 220, background: '#f3e8ff', color: '#7b8fa3' }}
        />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontWeight: 500, color: '#a3a7c2' }}>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.4rem', borderRadius: 8, border: '1px solid #e0d7ec', background: '#e0f7fa', color: '#7b8fa3' }}>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High-Low)</option>
            <option value="amount-asc">Amount (Low-High)</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div style={{ fontWeight: 500, color: '#a3a7c2' }}>Total: {txToShow.length}</div>
        <button onClick={exportCSV} style={{ background: '#b5ead7', color: '#7b8fa3', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #b5ead733' }}>Export CSV</button>
      </div>
      <div style={{ margin: '2.5rem 0', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #b5ead733', padding: '2rem 1rem' }}>
        <h3 style={{ fontWeight: 700, margin: 0, color: '#7b8fa3', fontSize: '1.3rem', marginBottom: 18 }}>All Transactions</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {txToShow.length === 0 && <li style={{ color: '#bbb', textAlign: 'center', fontWeight: 500 }}>No transactions yet.</li>}
          {txToShow.map(tx => (
            <li key={tx.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.2rem',
              borderBottom: '1px solid #f0e6f6',
              color: tx.type === 'income' ? '#5eaaa8' : '#e27d60',
              background: tx.type === 'income' ? '#e0f7fa' : '#f3e8ff',
              fontWeight: 600,
              borderRadius: '8px',
              marginBottom: '0.6rem',
              fontSize: 15,
              boxShadow: '0 1px 4px #b5ead733'
            }}>
              <span style={{ flex: 2 }}>{tx.date}</span>
              <span style={{ flex: 2 }}>{tx.category}</span>
              <span style={{ flex: 2 }}>{tx.description}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}</span>
              <button onClick={() => handleEdit(tx)} style={{marginLeft: 8, background: '#f7d6e0', color: '#7b8fa3', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer'}}>Edit</button>
              <button onClick={() => handleDelete(tx.id)} style={{marginLeft: 8, background: '#b5ead7', color: '#e27d60', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer'}}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Edit Modal */}
      {editId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '2rem', minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
            <button onClick={() => setEditId(null)} style={{ float: 'right', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
            <h3 style={{ marginTop: 0 }}>Edit Transaction</h3>
            <TransactionForm
              onAdd={handleUpdate}
              initialData={editData}
              isEdit
              allowDateInput
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
