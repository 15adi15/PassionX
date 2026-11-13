import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import UserCard from '../components/UserCard';

const QUICK_PASSIONS = ['All', 'Music', 'Dance', 'Philosophy', 'Science', 'Art', 'AI'];
const QUICK_CITIES = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune'];

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    passion: searchParams.get('passion') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query changes
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      passion: searchParams.get('passion') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
    });
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.passion && filters.passion !== 'All') params.passion = filters.passion;
      if (filters.city && filters.city !== 'All') params.city = filters.city;
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
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const handleQuickPassion = (p) => {
    const val = p === 'All' ? '' : p.toLowerCase();
    setFilters((prev) => ({ ...prev, passion: val }));
  };

  const handleQuickCity = (c) => {
    const val = c === 'All' ? '' : c.toLowerCase();
    setFilters((prev) => ({ ...prev, city: val }));
  };

  return (
    <div style={styles.page}>
      {/* Guest Notice Banner if not logged in */}
      {!user && (
        <div style={styles.guestBanner}>
          <div style={styles.guestText}>
            <span style={styles.guestSparkle}>✦</span>
            <span>
              You’re exploring as a guest. <strong>Join PassionX</strong> to connect with
              these members directly and build your profile!
            </span>
          </div>
          <Link to="/auth?mode=signup" style={styles.guestBtn}>
            Join Free →
          </Link>
        </div>
      )}

      {/* Page Title */}
      <div style={styles.header}>
        <span style={styles.subBadge}>DIRECTORY</span>
        <h1 style={styles.heading}>Discover Kindred Spirits</h1>
        <p style={styles.sub}>
          Filter by locality and shared curiosity to find your real-world community.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Quick Filter Pills */}
      <div style={styles.quickPillsRow}>
        <div style={styles.quickGroup}>
          <span style={styles.quickLabel}>Passions:</span>
          {QUICK_PASSIONS.map((p) => {
            const active =
              (p === 'All' && !filters.passion) ||
              filters.passion.toLowerCase() === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => handleQuickPassion(p)}
                style={{
                  ...styles.pillBtn,
                  ...(active ? styles.pillBtnActive : {}),
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div style={styles.quickGroup}>
          <span style={styles.quickLabel}>Cities:</span>
          {QUICK_CITIES.map((c) => {
            const active =
              (c === 'All' && !filters.city) ||
              filters.city.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => handleQuickCity(c)}
                style={{
                  ...styles.pillBtn,
                  ...(active ? styles.pillBtnActive : {}),
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading / Results */}
      {loading ? (
        <div style={styles.center}>
          <div style={styles.spinner} />
        </div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyText}>No people found matching your filters</p>
          <p style={styles.emptySub}>
            Try clearing your search query or selecting a different city or passion.
          </p>
          <button
            onClick={() => setFilters({ search: '', passion: '', city: '', state: '' })}
            style={styles.resetBtn}
          >
            Clear All Filters
          </button>
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
    padding: '2.5rem 0 5rem 0',
  },
  guestBanner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.9rem 1.4rem',
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(134, 239, 172, 0.15) 100%)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    marginBottom: '2rem',
  },
  guestText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#0f172a',
  },
  guestSparkle: {
    color: '#0284c7',
    fontSize: '1.1rem',
  },
  guestBtn: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#0f172a',
    padding: '0.45rem 1.1rem',
    borderRadius: 20,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
  },
  header: {
    marginBottom: '2rem',
  },
  subBadge: {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#0284c7',
    display: 'inline-block',
    marginBottom: '0.5rem',
  },
  heading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },
  sub: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: 400,
    marginTop: '0.4rem',
  },
  quickPillsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    marginBottom: '2rem',
  },
  quickGroup: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  quickLabel: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#475569',
    marginRight: '0.25rem',
  },
  pillBtn: {
    padding: '0.35rem 0.85rem',
    borderRadius: 20,
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#475569',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    border: '1px solid rgba(203, 213, 225, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillBtnActive: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderColor: '#0f172a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '5rem 0',
  },
  spinner: {
    width: 38,
    height: 38,
    border: '3px solid rgba(56, 189, 248, 0.25)',
    borderTop: '3px solid #0284c7',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '5rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.65rem',
  },
  emptyText: {
    fontSize: '1.15rem',
    color: '#0f172a',
    fontWeight: 600,
  },
  emptySub: {
    fontSize: '0.92rem',
    color: '#64748b',
    marginTop: '0.4rem',
    maxWidth: 440,
    margin: '0.4rem auto 1.5rem auto',
  },
  resetBtn: {
    padding: '0.55rem 1.4rem',
    borderRadius: 20,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: 500,
  },
};

export default Home;
