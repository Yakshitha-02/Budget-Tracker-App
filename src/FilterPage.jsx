import React, { useState } from 'react';
import Filter from './components/Filter';

function FilterPage() {
  const [transactions] = useState(() => JSON.parse(localStorage.getItem('transactions') || '[]'));
  const [filtered, setFiltered] = useState([]);

  const handleFilter = ({ category, date }) => {
    let filteredTx = transactions;
    if (category) filteredTx = filteredTx.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    if (date) filteredTx = filteredTx.filter(t => t.date === date);
    setFiltered(filteredTx);
  };

  return (
    <div style={{ maxWidth: 700, margin: '2.5rem auto', padding: '2rem', background: '#f7f6fa', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(180,180,255,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2.2rem', marginBottom: '2rem', color: '#7b8fa3', letterSpacing: 1 }}>Filter Transactions</h2>
      <Filter onFilter={handleFilter} />
      <div style={{ margin: '2rem 0', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #4f8cff11', padding: '2rem 1rem' }}>
        <h3 style={{ fontWeight: 700, margin: 0, color: '#4f8cff', fontSize: '1.3rem', marginBottom: 18 }}>Filtered Results</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.length === 0 && <li style={{ color: '#bbb', textAlign: 'center', fontWeight: 500 }}>No results.</li>}
          {filtered.map(tx => (
            <li key={tx.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.2rem',
              borderBottom: '1px solid #f0f0f0',
              color: tx.type === 'income' ? '#2e7d32' : '#c62828',
              background: tx.type === 'income' ? '#e8f5e9' : '#ffebee',
              fontWeight: 600,
              borderRadius: '8px',
              marginBottom: '0.6rem',
              fontSize: 15,
              boxShadow: '0 1px 4px #0001'
            }}>
              <span style={{ flex: 2 }}>{tx.date}</span>
              <span style={{ flex: 2 }}>{tx.category}</span>
              <span style={{ flex: 2 }}>{tx.description}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilterPage;