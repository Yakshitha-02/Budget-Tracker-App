// List of all transactions
function TransactionList({ transactions, onDelete, onEdit }) {
  if (transactions.length === 0) return <p style={{textAlign: 'center', color: '#888'}}>No transactions yet.</p>;
  return (
    <ul className="transaction-list" style={{
      listStyle: 'none',
      padding: 0,
      margin: '2rem auto',
      maxWidth: '400px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden'
    }}>
      {transactions.map(tx => (
        <li key={tx.id} className={tx.type} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #f0f0f0',
          color: tx.type === 'income' ? '#2e7d32' : '#c62828',
          background: tx.type === 'income' ? '#e8f5e9' : '#ffebee',
          fontWeight: 500
        }}>
          <span style={{flex: 2}}>{tx.date}</span>
          <span style={{flex: 2}}>{tx.category}</span>
          <span style={{flex: 2}}>{tx.description}</span>
          <span style={{flex: 1, textAlign: 'right'}}>{tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}</span>
          {onEdit && <button onClick={() => onEdit(tx)} style={{marginLeft: 8, background: '#ffb347', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer'}}>Edit</button>}
          {onDelete && <button onClick={() => onDelete(tx.id)} style={{marginLeft: 8, background: '#ff6961', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.7rem', cursor: 'pointer'}}>Delete</button>}
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;
