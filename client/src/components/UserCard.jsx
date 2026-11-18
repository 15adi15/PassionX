import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

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
  const { user: currentUser, connectUser, disconnectUser } = useAuth();
  const { isUserOnline, openChat, notifyConnection } = useSocket();
  const [userData, setUserData] = useState(user);
  const [connecting, setConnecting] = useState(false);
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminError, setAdminError] = useState('');
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    bio: user.aboutMe || user.bio || '',
    passions: (user.passions || []).join(', '),
    city: user.location?.city || '',
    state: user.location?.state || '',
  });

  const initials = getInitials(userData.name);
  const avatarBg = getAvatarColor(userData.name);
  const city = userData.location?.city;
  const state = userData.location?.state;
  const locationStr = [city, state].filter(Boolean).join(', ');
  const isOnline = isUserOnline(user._id);

  const isConnected = currentUser?.connections?.some(
    (c) => (typeof c === 'string' ? c : c._id) === user._id
  );

  const handleToggleConnect = async () => {
    if (!currentUser) return;
    setConnecting(true);
    try {
      if (isConnected) {
        await disconnectUser(user._id);
      } else {
        await connectUser(user._id);
        notifyConnection(user._id);
      }
    } catch (err) {
      console.error('Failed to update connection', err);
    } finally {
      setConnecting(false);
    }
  };

  const handleSaveAdminEdit = async (e) => {
    e.preventDefault();
    setAdminSaving(true);
    setAdminError('');
    setAdminSuccess('');
    try {
      const payload = {
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        aboutMe: editForm.bio.trim(),
        passions: editForm.passions
          .split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean),
        location: {
          city: editForm.city.trim(),
          state: editForm.state.trim(),
        },
      };
      const res = await API.put(`/users/manage/${user._id}`, payload);
      setUserData(res.data.user);
      setAdminSuccess('Profile updated with Administrator authorization!');
      setTimeout(() => {
        setShowAdminEditModal(false);
        setAdminSuccess('');
      }, 1100);
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Failed to update user profile');
    } finally {
      setAdminSaving(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        {/* Avatar with live WebSocket online indicator */}
        <div style={styles.avatarContainer}>
          {userData.avatar ? (
            <img src={userData.avatar} alt={userData.name} style={styles.avatarImg} />
          ) : (
            <div style={{ ...styles.avatar, backgroundColor: avatarBg }}>
              <span style={styles.initials}>{initials}</span>
            </div>
          )}
          {isOnline && (
            <span
              style={styles.onlineDot}
              title="Active now via WebSocket"
            />
          )}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.nameRow}>
            <h3 style={styles.name}>{userData.name}</h3>
            {isOnline && <span style={styles.onlineBadgeText}>Live</span>}
          </div>
          {locationStr && <p style={styles.location}>📍 {locationStr}</p>}
        </div>
      </div>

      {/* Bio / About */}
      {userData.aboutMe || userData.bio ? (
        <p style={styles.bio}>
          {(userData.aboutMe || userData.bio).length > 110
            ? (userData.aboutMe || userData.bio).slice(0, 110) + '…'
            : userData.aboutMe || userData.bio}
        </p>
      ) : (
        <p style={{ ...styles.bio, fontStyle: 'italic', opacity: 0.7 }}>
          Active PassionX creator in {city || 'India'}.
        </p>
      )}

      {/* Passion & Interests tags */}
      {userData.passions?.length > 0 && (
        <div style={styles.tags}>
          {userData.passions.map((p) => {
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

      {/* Connect action & Live Chat & Admin Edit */}
      <div style={styles.cardFooter}>
        {currentUser ? (
          <div style={styles.actionRow}>
            <button
              onClick={handleToggleConnect}
              disabled={connecting}
              style={{
                ...styles.connectBtn,
                ...(isConnected ? styles.connectedBtn : {}),
              }}
            >
              {connecting
                ? 'Updating...'
                : isConnected
                ? '✓ Connected'
                : 'Connect ✦'}
            </button>
            {isConnected ? (
              <button
                onClick={() => openChat(userData)}
                style={styles.chatBtn}
                title="Open real-time live chat"
              >
                Chat 💬
              </button>
            ) : (
              <a
                href={`mailto:${userData.email}?subject=Hi%20${encodeURIComponent(
                  userData.name
                )},%20saw%20you%20on%20PassionX!`}
                style={styles.helloBtn}
                title="Send email"
              >
                Say Hello 👋
              </a>
            )}

            {/* Admin Override Action Button */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setShowAdminEditModal(true)}
                style={styles.adminEditBtn}
                title="Administrator Privilege: Edit this member profile"
              >
                ✏️ Edit (Admin)
              </button>
            )}
          </div>
        ) : (
          <Link to="/auth?mode=signup" style={styles.connectBtn}>
            Connect ✦
          </Link>
        )}
      </div>

      {/* ================= ADMIN EDIT MODAL ================= */}
      {showAdminEditModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAdminEditModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>🛡️ Administrator Profile Editor</h3>
                <p style={styles.modalSub}>
                  Modifying profile of: <strong>{userData.name}</strong> (Target ID: <code>{user._id}</code>)
                </p>
              </div>
              <button
                onClick={() => setShowAdminEditModal(false)}
                style={styles.modalCloseBtn}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdminEdit} style={styles.modalForm}>
              {adminError && <div style={styles.modalErrorBanner}>{adminError}</div>}
              {adminSuccess && <div style={styles.modalSuccessBanner}>{adminSuccess}</div>}

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Bio / About Me</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  style={styles.modalTextarea}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Passions (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.passions}
                  onChange={(e) => setEditForm({ ...editForm, passions: e.target.value })}
                  placeholder="e.g. music, coding, philosophy"
                  style={styles.modalInput}
                />
              </div>

              <div className="responsive-grid-2" style={styles.modalGrid2}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    style={styles.modalInput}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    style={styles.modalInput}
                  />
                </div>
              </div>

              <div style={styles.adminPrivilegeNote}>
                ⚡ <strong>Admin Authorization Active:</strong> Backend route <code>PUT /api/users/manage/:id</code> with middleware <code>authorizeOwnership</code> verified your <code>admin</code> role and granted cross-user modification rights.
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowAdminEditModal(false)}
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminSaving}
                  style={styles.modalSaveBtn}
                >
                  {adminSaving ? 'Saving Changes...' : 'Save as Admin ✦'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  onlineDot: {
    position: 'absolute',
    bottom: '1px',
    right: '1px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    border: '2px solid #ffffff',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  onlineBadgeText: {
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#059669',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: '0.1rem 0.35rem',
    borderRadius: 6,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
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
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
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
  actionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.55rem',
  },
  connectBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '0.55rem 1rem',
    borderRadius: 14,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: 600,
    textAlign: 'center',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  connectedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#059669',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  helloBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.55rem 0.9rem',
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    color: '#0284c7',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    fontSize: '0.84rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  chatBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.55rem 0.95rem',
    borderRadius: 14,
    backgroundColor: '#0284c7',
    color: '#ffffff',
    fontSize: '0.84rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
  },
  adminEditBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.55rem 0.95rem',
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  modalTitle: {
    fontSize: '1.08rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  modalSub: {
    fontSize: '0.82rem',
    color: '#64748b',
    margin: '0.25rem 0 0 0',
  },
  modalCloseBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0.2rem',
  },
  modalForm: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  inputLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  modalInput: {
    padding: '0.6rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: '0.88rem',
    color: '#0f172a',
    outline: 'none',
  },
  modalTextarea: {
    padding: '0.6rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: '0.88rem',
    color: '#0f172a',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalGrid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  adminPrivilegeNote: {
    backgroundColor: '#fff1f2',
    border: '1px solid #fecdd3',
    borderRadius: 10,
    padding: '0.65rem 0.85rem',
    fontSize: '0.78rem',
    color: '#9f1239',
    lineHeight: 1.5,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.6rem',
    marginTop: '0.5rem',
  },
  modalCancelBtn: {
    padding: '0.55rem 1.1rem',
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSaveBtn: {
    padding: '0.55rem 1.25rem',
    borderRadius: 14,
    backgroundColor: '#b91c1c',
    color: '#ffffff',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(185, 28, 28, 0.25)',
  },
  modalErrorBanner: {
    padding: '0.6rem 0.9rem',
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.84rem',
    fontWeight: 500,
  },
  modalSuccessBanner: {
    padding: '0.6rem 0.9rem',
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '0.84rem',
    fontWeight: 600,
  },
};

export default UserCard;
