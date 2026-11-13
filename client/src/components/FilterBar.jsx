const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.bar}>
      <input
        type="text"
        name="search"
        placeholder="Search by name…"
        value={filters.search || ''}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="passion"
        placeholder="Passion (e.g. music)"
        value={filters.passion || ''}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city || ''}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={filters.state || ''}
        onChange={handleChange}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  bar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    padding: '1rem 1.2rem',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
    marginBottom: '1.5rem',
  },
  input: {
    flex: '1 1 180px',
    padding: '0.65rem 1rem',
    fontSize: '0.88rem',
    fontWeight: 400,
    color: '#1e293b',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: 12,
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
};

export default FilterBar;
