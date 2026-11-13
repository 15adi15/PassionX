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
  const colors = ['#38bdf8', '#86efac', '#fbbf24', '#c084fc', '#fb923c', '#67e8f9'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const UserCard = ({ user }) => {
  const initials = getInitials(user.name);
  const avatarBg = getAvatarColor(user.name);
  const city = user.location?.city;
  const state = user.location?.state;
  const locationStr = [city, state].filter(Boolean).join(', ');

  return (
    <div style={styles.card}>
      {/* Avatar */}
      <div style={{ ...styles.avatar, backgroundColor: avatarBg }}>
        <span style={styles.initials}>{initials}</span>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.name}>{user.name}</h3>
        {locationStr && (
          <p style={styles.location}>📍 {locationStr}</p>
        )}
        {user.bio && (
          <p style={styles.bio}>
            {user.bio.length > 80 ? user.bio.slice(0, 80) + '…' : user.bio}
          </p>
        )}
      </div>

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
    </div>
  );
};

const styles = {
  card: {
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    padding: '1.6rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '0.04em',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  location: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 400,
  },
  bio: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.5,
    fontWeight: 300,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginTop: '0.2rem',
  },
  tag: {
    fontSize: '0.72rem',
    fontWeight: 500,
    padding: '0.28rem 0.7rem',
    borderRadius: 50,
    letterSpacing: '0.02em',
  },
};

export default UserCard;
