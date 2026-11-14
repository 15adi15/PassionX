import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/auth');
  };

  const isLanding = location.pathname === '/';

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>✦</span>
          <span style={styles.brandText}>PassionX</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-desktop">
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(location.pathname === '/' ? styles.activeLink : {}),
            }}
          >
            Home
          </Link>
          <Link
            to="/discover"
            style={{
              ...styles.link,
              ...(location.pathname === '/discover' ? styles.activeLink : {}),
            }}
          >
            Discover People
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  ...styles.link,
                  ...(location.pathname === '/profile' ? styles.activeLink : {}),
                }}
              >
                Profile
              </Link>
              <Link to="/profile" style={styles.userBadge}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={styles.navAvatarImg} />
                ) : (
                  <span style={styles.avatarDot}>
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                )}
                <span style={styles.userName}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/auth" style={styles.signInBtn}>
                Sign In
              </Link>
              <Link to="/auth?mode=signup" style={styles.joinBtn}>
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <Link
            to="/"
            style={{
              ...styles.mobileLink,
              ...(location.pathname === '/' ? styles.activeMobileLink : {}),
            }}
          >
            Home
          </Link>
          <Link
            to="/discover"
            style={{
              ...styles.mobileLink,
              ...(location.pathname === '/discover' ? styles.activeMobileLink : {}),
            }}
          >
            Discover People
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  ...styles.mobileLink,
                  ...(location.pathname === '/profile' ? styles.activeMobileLink : {}),
                }}
              >
                Profile ({user.name?.split(' ')[0]})
              </Link>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <div style={styles.mobileAuthRow}>
              <Link to="/auth" style={styles.mobileSignInBtn}>
                Sign In
              </Link>
              <Link to="/auth?mode=signup" style={styles.mobileJoinBtn}>
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(250, 248, 245, 0.82)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
    transition: 'background 0.3s ease',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0.85rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.45rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontFamily: 'var(--font-serif)',
  },
  brandIcon: {
    fontSize: '1.2rem',
    color: '#0284c7',
  },
  brandText: {
    fontFamily: 'var(--font-serif)',
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
  },
  link: {
    fontSize: '0.92rem',
    fontWeight: 500,
    color: '#475569',
    transition: 'color 0.2s ease',
    letterSpacing: '-0.01em',
  },
  activeLink: {
    color: '#0f172a',
    fontWeight: 600,
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.65rem 0.25rem 0.35rem',
    background: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 20,
    border: '1px solid rgba(56, 189, 248, 0.25)',
  },
  navAvatarImg: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarDot: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: '0.84rem',
    fontWeight: 500,
    color: '#0369a1',
  },
  logoutBtn: {
    fontSize: '0.84rem',
    fontWeight: 500,
    color: '#b91c1c',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 20,
    padding: '0.42rem 1.1rem',
    cursor: 'pointer',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
  },
  signInBtn: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#0f172a',
    padding: '0.45rem 1rem',
    borderRadius: 20,
    transition: 'all 0.2s ease',
  },
  joinBtn: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '0.5rem 1.25rem',
    borderRadius: 24,
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
    transition: 'all 0.25s ease',
  },
  mobileLink: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#475569',
    padding: '0.6rem 0',
    borderBottom: '1px solid rgba(241, 245, 249, 0.8)',
  },
  activeMobileLink: {
    color: '#0f172a',
    fontWeight: 700,
  },
  mobileLogoutBtn: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#dc2626',
    background: 'rgba(239, 68, 68, 0.08)',
    border: 'none',
    borderRadius: 12,
    padding: '0.65rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '0.4rem',
  },
  mobileAuthRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  mobileSignInBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '0.65rem 1rem',
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontWeight: 600,
    fontSize: '0.92rem',
    color: '#0f172a',
  },
  mobileJoinBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '0.65rem 1rem',
    borderRadius: 14,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.92rem',
  },
};

export default Navbar;
