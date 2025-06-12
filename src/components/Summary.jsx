// Summary of totals and balance
function Summary({ transactions }) {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  return (
    <div className="summary" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      margin: '2rem 0 1rem 0',
      fontSize: '1.1rem',
      fontWeight: 500
    }}>
      <div style={{ color: '#2e7d32', background: '#e8f5e9', padding: '0.7rem 1.2rem', borderRadius: '8px' }}>
        Total Income: <span className="income">${income.toFixed(2)}</span>
      </div>
      <div style={{ color: '#c62828', background: '#ffebee', padding: '0.7rem 1.2rem', borderRadius: '8px' }}>
        Total Expenses: <span className="expense">${expenses.toFixed(2)}</span>
      </div>
      <div style={{ color: balance >= 0 ? '#2e7d32' : '#c62828', background: balance >= 0 ? '#e8f5e9' : '#ffebee', padding: '0.7rem 1.2rem', borderRadius: '8px' }}>
        Balance: <span className={balance >= 0 ? 'positive' : 'negative'}>${balance.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default Summary;
