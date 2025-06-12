// Filter transactions by category or date
import { useState } from 'react';

function Filter({ onFilter }) {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ category, date });
  };

  return (
    <form className="filter-form" onSubmit={handleFilter}>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <button type="submit">Filter</button>
    </form>
  );
}

export default Filter;
