import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>✦</span> PassionX
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Discover
          </Link>
          <Link to="/profile" style={styles.link}>
            Profile
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.45)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.04)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0.85rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.35rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  brandIcon: {
    fontSize: '1.1rem',
    color: '#38bdf8',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem',
  },
  link: {
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#475569',
    transition: 'color 0.3s ease',
    letterSpacing: '0.01em',
  },
  logoutBtn: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: 20,
    padding: '0.4rem 1.1rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
};

export default Navbar;
