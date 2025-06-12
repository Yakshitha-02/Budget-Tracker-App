import { useMemo } from 'react';
import Summary from './components/Summary';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const COLORS = ['#4f8cff', '#ffb347', '#ff6961', '#77dd77', '#f49ac2', '#aec6cf', '#cfcfc4', '#b39eb5', '#836953', '#03c03c'];
const DEMO_BUDGET = 2000;

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // 'YYYY-MM'
  const monthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonth));
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);
  const byCategory = useMemo(() => {
    const cat = {};
    transactions.forEach(t => {
      if (!cat[t.category]) cat[t.category] = 0;
      cat[t.category] += t.type === 'income' ? t.amount : -t.amount;
    });
    return cat;
  }, [transactions]);
  const categories = Object.keys(byCategory);
  const amounts = Object.values(byCategory);
  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Net by Category',
        data: amounts,
        backgroundColor: '#4f8cff',
      },
    ],
  };
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: 'Net by Category',
        data: amounts,
        backgroundColor: COLORS,
      },
    ],
  };

  // Monthly summary
  const monthIncome = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthExpenses = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthBalance = monthIncome - monthExpenses;
  const budgetPercent = Math.min((monthExpenses / DEMO_BUDGET) * 100, 100);

  // Top 3 expense categories for the month
  const catTotals = {};
  monthTx.filter(t => t.type === 'expense').forEach(t => {
    if (!catTotals[t.category]) catTotals[t.category] = 0;
    catTotals[t.category] += t.amount;
  });
  const topCats = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Greeting
  const greeting = `Hello${user.email ? ', ' + user.email.split('@')[0] : ''}! Today is ${today.toLocaleDateString()}`;

  return (
    <div style={{ maxWidth: 1100, margin: '2.5rem auto', padding: '2.5rem', background: '#f7f6fa', borderRadius: 22, boxShadow: '0 4px 32px 0 rgba(180,180,255,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.3rem', marginBottom: '2.2rem', color: '#7b8fa3', letterSpacing: 1 }}>Dashboard</h2>
      {/* Personalized Greeting */}
      <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 18, color: '#4f8cff', letterSpacing: 0.5, textShadow: '0 1px 0 #fff' }}>{greeting}</div>
      {/* Monthly Summary */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ color: '#fff', background: 'linear-gradient(90deg,#4f8cff,#77dd77)', padding: '1.1rem 2.2rem', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px #4f8cff22' }}>
          <span style={{ opacity: 0.8 }}>Income (This Month):</span> <span style={{ fontWeight: 900 }}>${monthIncome.toFixed(2)}</span>
        </div>
        <div style={{ color: '#fff', background: 'linear-gradient(90deg,#ff6961,#ffb347)', padding: '1.1rem 2.2rem', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px #ff696122' }}>
          <span style={{ opacity: 0.8 }}>Expenses (This Month):</span> <span style={{ fontWeight: 900 }}>${monthExpenses.toFixed(2)}</span>
        </div>
        <div style={{ color: '#fff', background: monthBalance >= 0 ? 'linear-gradient(90deg,#4f8cff,#2e7d32)' : 'linear-gradient(90deg,#ff6961,#c62828)', padding: '1.1rem 2.2rem', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px #2e7d3222' }}>
          <span style={{ opacity: 0.8 }}>Balance:</span> <span style={{ fontWeight: 900 }}>${monthBalance.toFixed(2)}</span>
        </div>
      </div>
      {/* Budget Progress Bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#4f8cff' }}>Monthly Budget Progress</div>
        <div style={{ background: '#e3f0ff', borderRadius: 12, height: 22, overflow: 'hidden', marginBottom: 6, boxShadow: '0 1px 4px #4f8cff11' }}>
          <div style={{ width: `${budgetPercent}%`, background: budgetPercent < 100 ? 'linear-gradient(90deg,#4f8cff,#77dd77)' : 'linear-gradient(90deg,#ff6961,#c62828)', height: '100%', borderRadius: 12, transition: 'width 0.3s' }}></div>
        </div>
        <div style={{ fontSize: 15, color: budgetPercent < 100 ? '#4f8cff' : '#c62828', fontWeight: 600 }}>{budgetPercent.toFixed(1)}% of ${DEMO_BUDGET} spent</div>
      </div>
      {/* Top 3 Categories */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#4f8cff' }}>Top 3 Expense Categories (This Month):</div>
        {topCats.length === 0 ? (
          <div style={{ color: '#bbb', fontWeight: 500, fontSize: 15 }}>No expenses this month.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1.5rem' }}>
            {topCats.map(([cat, amt], idx) => (
              <li key={cat} style={{ background: COLORS[idx % COLORS.length], color: '#fff', borderRadius: 10, padding: '0.7rem 1.3rem', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px #0001' }}>
                {cat}: <span style={{ fontWeight: 900 }}>${amt.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2.2rem', marginBottom: '2rem', color: '#4f8cff', letterSpacing: 1 }}>Dashboard Overview</h2>
      <Summary transactions={transactions} />
      <div style={{ margin: '2.5rem 0', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #4f8cff11', padding: '2rem 1rem' }}>
        <h3 style={{ fontWeight: 700, margin: 0, color: '#4f8cff', fontSize: '1.3rem', marginBottom: 18 }}>Spending & Income by Category</h3>
        {categories.length === 0 ? (
          <div style={{ color: '#bbb', textAlign: 'center', fontWeight: 500 }}>No data to display.</div>
        ) : (
          <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: 220, background: '#f6f8fa', borderRadius: 10, padding: 12, boxShadow: '0 1px 4px #4f8cff11' }}>
              <Bar data={barData} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 220, background: '#f6f8fa', borderRadius: 10, padding: 12, boxShadow: '0 1px 4px #4f8cff11' }}>
              <Pie data={pieData} options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
              }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: '2.5rem', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #4f8cff11', padding: '2rem 1rem' }}>
        <h3 style={{ fontWeight: 700, margin: 0, color: '#4f8cff', fontSize: '1.3rem', marginBottom: 18 }}>Recent Transactions</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {recent.length === 0 && <li style={{ color: '#bbb', textAlign: 'center', fontWeight: 500 }}>No recent transactions.</li>}
          {recent.map(tx => (
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

export default Dashboard;
