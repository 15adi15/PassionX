import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PASSION_COLORS = [
  { bg: 'rgba(56, 189, 248, 0.12)', color: '#0284c7' },
  { bg: 'rgba(134, 239, 172, 0.18)', color: '#15803d' },
  { bg: 'rgba(253, 186, 116, 0.18)', color: '#c2410c' },
  { bg: 'rgba(196, 181, 253, 0.18)', color: '#7c3aed' },
  { bg: 'rgba(252, 165, 165, 0.15)', color: '#dc2626' },
  { bg: 'rgba(253, 224, 71, 0.18)', color: '#a16207' },
  { bg: 'rgba(147, 197, 253, 0.18)', color: '#2563eb' },
  { bg: 'rgba(167, 243, 208, 0.18)', color: '#059669' },
];

const getPassionColor = (passion) => {
  let hash = 0;
  for (let i = 0; i < passion.length; i++) {
    hash = passion.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PASSION_COLORS[Math.abs(hash) % PASSION_COLORS.length];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = ['#0284c7', '#059669', '#d97706', '#7c3aed', '#ea580c', '#0891b2'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const initials = getInitials(user.name);
  const avatarBg = getAvatarColor(user.name);
  const city = user.location?.city;
  const state = user.location?.state;
  const locationStr = [city, state].filter(Boolean).join(', ');

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        {/* Avatar */}
        <div style={{ ...styles.avatar, backgroundColor: avatarBg }}>
          <span style={styles.initials}>{initials}</span>
        </div>
        <div style={styles.headerInfo}>
          <h3 style={styles.name}>{user.name}</h3>
          {locationStr && <p style={styles.location}>📍 {locationStr}</p>}
        </div>
      </div>

      {/* Bio */}
      {user.bio ? (
        <p style={styles.bio}>
          {user.bio.length > 110 ? user.bio.slice(0, 110) + '…' : user.bio}
        </p>
      ) : (
        <p style={{ ...styles.bio, fontStyle: 'italic', opacity: 0.7 }}>
          Active PassionX creator in {city || 'India'}.
        </p>
      )}

      {/* Passion tags */}
      {user.passions?.length > 0 && (
        <div style={styles.tags}>
          {user.passions.map((p) => {
            const c = getPassionColor(p);
            return (
              <span
                key={p}
                style={{ ...styles.tag, backgroundColor: c.bg, color: c.color }}
              >
                {p}
              </span>
            );
          })}
        </div>
      )}

      {/* Connect action */}
      <div style={styles.cardFooter}>
        {currentUser ? (
          <a
            href={`mailto:${user.email}?subject=Hi%20${encodeURIComponent(user.name)},%20saw%20you%20on%20PassionX!`}
            style={styles.connectBtn}
          >
            Say Hello 👋
          </a>
        ) : (
          <Link to="/auth?mode=signup" style={styles.connectBtn}>
            Connect ✦
          </Link>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.75)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: 22,
    padding: '1.6rem',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  initials: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '0.04em',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.015em',
  },
  location: {
    fontSize: '0.82rem',
    color: '#64748b',
    fontWeight: 500,
    marginTop: '0.1rem',
  },
  bio: {
    fontSize: '0.88rem',
    color: '#475569',
    lineHeight: 1.55,
    fontWeight: 400,
    flexGrow: 1,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  tag: {
    fontSize: '0.74rem',
    fontWeight: 600,
    padding: '0.28rem 0.72rem',
    borderRadius: 50,
    letterSpacing: '0.01em',
    textTransform: 'capitalize',
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: '0.6rem',
    borderTop: '1px solid rgba(241, 245, 249, 0.9)',
  },
  connectBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.55rem 1rem',
    borderRadius: 14,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: 600,
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
};

export default UserCard;
