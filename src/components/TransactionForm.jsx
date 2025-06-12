// Form to add new income or expense
import { useState, useEffect } from 'react';

function TransactionForm({ onAdd, initialData, isEdit, allowDateInput }) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    const tx = {
      id: isEdit && initialData ? initialData.id : Date.now(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: allowDateInput ? date : (isEdit && initialData ? initialData.date : new Date().toISOString().slice(0, 10)),
    };
    onAdd(tx);
    if (!isEdit) {
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '350px',
      margin: '1.5rem auto',
      padding: '1.5rem',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
    }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          style={{ flex: 2, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>
      {allowDateInput && (
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      )}
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{
        padding: '0.6rem',
        borderRadius: '6px',
        border: 'none',
        background: '#4f8cff',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '0.5rem',
        transition: 'background 0.2s'
      }}>{isEdit ? 'Update' : 'Add'}</button>
    </form>
  );
}

export default TransactionForm;
