import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

const COLORS = ['#4f8cff', '#ffb347', '#ff6961', '#77dd77', '#f49ac2', '#aec6cf', '#cfcfc4', '#b39eb5', '#836953', '#03c03c'];

function getCurrentMonth() {
  const now = new Date();
  return now.toISOString().slice(0, 7); // 'YYYY-MM'
}

function Reports() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const currentMonth = getCurrentMonth();
  // Filter for current month
  const monthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonth));

  // PieChart: category-wise spending (expenses only)
  const pieData = useMemo(() => {
    const cat = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      if (!cat[t.category]) cat[t.category] = 0;
      cat[t.category] += t.amount;
    });
    return Object.entries(cat).map(([name, value]) => ({ name, value }));
  }, [monthTx]);

  // LineChart: daily spending trend (expenses only)
  const lineData = useMemo(() => {
    const days = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      const day = t.date;
      if (!days[day]) days[day] = 0;
      days[day] += t.amount;
    });
    return Object.entries(days).map(([date, value]) => ({ date, value }));
  }, [monthTx]);

  // BarChart: Income vs Expenses (current month)
  const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const barData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses }
  ];

  // Top 5 highest expense transactions
  const topExpenses = monthTx.filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Budget category progress bars (assume static budget per category for demo)
  const budgets = { Food: 500, Rent: 1000, Shopping: 300, Travel: 200, Other: 200 };
  const catProgress = Object.keys(budgets).map(cat => {
    const spent = monthTx.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0);
    return { category: cat, spent, budget: budgets[cat], percent: Math.min((spent / budgets[cat]) * 100, 100) };
  });

  return (
    <div style={{ maxWidth: 1100, margin: '2.5rem auto', padding: '2.5rem', background: '#f7f6fa', borderRadius: 22, boxShadow: '0 4px 32px 0 rgba(180,180,255,0.10)' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.3rem', marginBottom: '2.2rem', color: '#7b8fa3', letterSpacing: 1 }}>Reports & Analytics</h2>
      {/* Charts Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: 300, maxWidth: 350, background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px #4f8cff11' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center', color: '#4f8cff' }}>Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 2, minWidth: 350, maxWidth: 500, background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px #4f8cff11' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center', color: '#4f8cff' }}>Daily Spending Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="value" stroke="#ff6961" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, maxWidth: 350, background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px #4f8cff11' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 10, textAlign: 'center', color: '#4f8cff' }}>Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4f8cff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top 5 Expenses */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px #4f8cff11', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 10, color: '#4f8cff' }}>Top 5 Highest Expenses (This Month)</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {topExpenses.length === 0 && <li style={{ color: '#bbb', textAlign: 'center', fontWeight: 500 }}>No expenses this month.</li>}
          {topExpenses.map(tx => (
            <li key={tx.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.2rem',
              borderBottom: '1px solid #f0f0f0',
              color: '#c62828',
              background: '#ffebee',
              fontWeight: 600,
              borderRadius: '8px',
              marginBottom: '0.6rem',
              fontSize: 15,
              boxShadow: '0 1px 4px #0001'
            }}>
              <span style={{ flex: 2 }}>{tx.date}</span>
              <span style={{ flex: 2 }}>{tx.category}</span>
              <span style={{ flex: 2 }}>{tx.description}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>-${tx.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Budget Category Progress Bars */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px #4f8cff11' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 10, color: '#4f8cff' }}>Budget Category Progress</h3>
        {catProgress.map(cat => (
          <div key={cat.category} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#222' }}>
              <span>{cat.category}</span>
              <span>${cat.spent.toFixed(2)} / ${cat.budget}</span>
            </div>
            <div style={{ background: '#eee', borderRadius: 10, height: 16, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ width: `${cat.percent}%`, background: cat.percent < 100 ? 'linear-gradient(90deg,#4f8cff,#77dd77)' : 'linear-gradient(90deg,#ff6961,#c62828)', height: '100%', borderRadius: 10, transition: 'width 0.3s' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
