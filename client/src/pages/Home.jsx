import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import FilterBar from '../components/FilterBar';
import UserCard from '../components/UserCard';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    passion: '',
    city: '',
    state: '',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.passion) params.passion = filters.passion;
      if (filters.city) params.city = filters.city;
      if (filters.state) params.state = filters.state;

      const { data } = await API.get('/users/discover', { params });
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 350);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Discover People</h1>
        <p style={styles.sub}>Find others who share your passions</p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <div style={styles.center}>
          <div style={styles.spinner} />
        </div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyText}>No people found matching your filters</p>
          <p style={styles.emptySub}>Try broadening your search</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {users.map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '1.5rem 0',
  },
  header: {
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  sub: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: 300,
    marginTop: '0.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 0',
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid rgba(135,206,235,0.25)',
    borderTop: '3px solid #38bdf8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  emptyIcon: {
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1.05rem',
    color: '#475569',
    fontWeight: 400,
  },
  emptySub: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: 300,
    marginTop: '0.3rem',
  },
};

export default Home;
