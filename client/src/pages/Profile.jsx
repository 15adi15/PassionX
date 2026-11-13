import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';

const PASSION_COLORS = [
  { bg: 'rgba(56, 189, 248, 0.12)', color: '#0284c7' },
  { bg: 'rgba(134, 239, 172, 0.18)', color: '#15803d' },
  { bg: 'rgba(253, 186, 116, 0.18)', color: '#c2410c' },
  { bg: 'rgba(196, 181, 253, 0.18)', color: '#7c3aed' },
  { bg: 'rgba(252, 165, 165, 0.15)', color: '#dc2626' },
  { bg: 'rgba(253, 224, 71, 0.18)', color: '#a16207' },
  { bg: 'rgba(147, 197, 253, 0.18)', color: '#2563eb' },
];

const SUGGESTED_INTERESTS = [
  'Singing',
  'Acoustic Guitar',
  'Debates',
  'Philosophy',
  'Kathak',
  'Hip-Hop Dance',
  'Astronomy',
  'Ceramics & Pottery',
  'Literature',
  'AI & Tech',
  'Film Making',
  'Mindfulness',
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
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

const Profile = () => {
  const { user, updateProfile, disconnectUser } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'people'
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    aboutMe:
      user?.aboutMe ||
      user?.bio ||
      'Hey there! I joined PassionX to connect with curious, passionate people in my city. Always down for creative jams, meaningful discussions, and exploring new horizons.',
    lookingFor:
      user?.lookingFor ||
      'Looking for fellow creators and deep thinkers for weekend meetups, coffee chats, and collaborative projects.',
    passions: user?.passions || [],
    interests: user?.interests || user?.passions || [],
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    avatar: user?.avatar || '',
  });

  const [newInterest, setNewInterest] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterest = (item) => {
    const p = (item || newInterest).trim().toLowerCase();
    if (p && !form.passions.includes(p)) {
      setForm({ ...form, passions: [...form.passions, p] });
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (interest) => {
    setForm({
      ...form,
      passions: form.passions.filter((p) => p !== interest),
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: String(reader.result) }));
      setShowPhotoModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url) => {
    setForm((prev) => ({ ...prev, avatar: url }));
    setShowPhotoModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        name: form.name,
        bio: form.aboutMe,
        aboutMe: form.aboutMe,
        lookingFor: form.lookingFor,
        passions: form.passions,
        interests: form.passions,
        location: { city: form.city, state: form.state },
        avatar: form.avatar,
      });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      bio: user?.bio || '',
      aboutMe: user?.aboutMe || user?.bio || '',
      lookingFor: user?.lookingFor || '',
      passions: user?.passions || [],
      interests: user?.interests || user?.passions || [],
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      avatar: user?.avatar || '',
    });
    setEditing(false);
    setError('');
  };

  if (!user) return null;

  const connections = user.connections || [];
  const initials = getInitials(user.name);

  return (
    <div style={styles.wrapper}>
      {/* ================= HERO PROFILE HEADER BANNER ================= */}
      <div style={styles.headerCard}>
        {/* Soft decorative cover gradient */}
        <div style={styles.coverBanner} />

        <div style={styles.headerContent}>
          {/* Avatar with Photo Option */}
          <div style={styles.avatarWrapper}>
            {form.avatar || user.avatar ? (
              <img
                src={form.avatar || user.avatar}
                alt={user.name}
                style={styles.avatarImg}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <span>{initials}</span>
              </div>
            )}
            <button
              onClick={() => setShowPhotoModal(true)}
              style={styles.photoUploadBtn}
              title="Change profile photo"
            >
              📷
            </button>
          </div>

          {/* User Details */}
          <div style={styles.mainInfo}>
            <div style={styles.nameRow}>
              <h1 style={styles.userName}>{user.name}</h1>
              <span style={styles.verifiedBadge}>✦ PassionX Member</span>
            </div>
            <p style={styles.userEmail}>{user.email}</p>
            <p style={styles.userLocation}>
              📍 {[user.location?.city, user.location?.state].filter(Boolean).join(', ') || 'Mumbai, Maharashtra'}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div style={styles.headerActions}>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div style={styles.saveCancelRow}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={styles.saveBtn}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleCancel} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= TABS SYSTEM ================= */}
        <div style={styles.tabsRow}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'profile' ? styles.tabBtnActive : {}),
            }}
          >
            ✦ Profile & About Me
          </button>
          <button
            onClick={() => setActiveTab('people')}
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'people' ? styles.tabBtnActive : {}),
            }}
          >
            🤝 My People ({connections.length})
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* ================= TAB 1: PROFILE & ABOUT ME ================= */}
      {activeTab === 'profile' && (
        <div style={styles.profileLayout}>
          {/* Left Column: About Me & What I'm Looking For */}
          <div style={styles.leftCol}>
            {/* About Me Card */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionBar} />
                <h3 style={styles.sectionTitle}>About Me</h3>
              </div>

              {!editing ? (
                <p style={styles.aboutText}>
                  {user.aboutMe ||
                    user.bio ||
                    'Hey there! I joined PassionX to connect with curious, passionate people in my city. Always down for creative jams, meaningful discussions, and exploring new horizons.'}
                </p>
              ) : (
                <textarea
                  name="aboutMe"
                  value={form.aboutMe}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell people about your journey, what excites you, and what you love creating..."
                  style={styles.textarea}
                />
              )}
            </div>

            {/* What I'm Looking For Card */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <span style={{ ...styles.sectionBar, backgroundColor: '#10b981' }} />
                <h3 style={styles.sectionTitle}>What I’m Looking For</h3>
              </div>

              {!editing ? (
                <p style={styles.aboutText}>
                  {user.lookingFor ||
                    'Looking for fellow creators and deep thinkers for weekend meetups, coffee chats, and collaborative projects.'}
                </p>
              ) : (
                <textarea
                  name="lookingFor"
                  value={form.lookingFor}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Weekend jam buddies in Bandra, philosophy discussions, pottery partners..."
                  style={styles.textarea}
                />
              )}
            </div>

            {/* City & Location Details */}
            {editing && (
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <span style={{ ...styles.sectionBar, backgroundColor: '#f59e0b' }} />
                  <h3 style={styles.sectionTitle}>City & Locality</h3>
                </div>
                <div style={styles.locationInputsRow}>
                  <input
                    type="text"
                    name="city"
                    placeholder="City (e.g. Mumbai)"
                    value={form.city}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State (e.g. Maharashtra)"
                    value={form.state}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: My Interests & Community Stats */}
          <div style={styles.rightCol}>
            {/* My Interests Section */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <span style={{ ...styles.sectionBar, backgroundColor: '#7c3aed' }} />
                <h3 style={styles.sectionTitle}>My Interests & Passions</h3>
              </div>

              {/* Tag Pills */}
              <div style={styles.tagsContainer}>
                {form.passions.length > 0 ? (
                  form.passions.map((p) => {
                    const c = getPassionColor(p);
                    return (
                      <span
                        key={p}
                        style={{
                          ...styles.passionTag,
                          backgroundColor: c.bg,
                          color: c.color,
                        }}
                      >
                        {p}
                        {editing && (
                          <button
                            onClick={() => handleRemoveInterest(p)}
                            style={styles.tagRemoveBtn}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <p style={styles.emptyTagsNotice}>
                    No interests added yet. Add some to get discovered!
                  </p>
                )}
              </div>

              {/* Add Interest Input (when editing) */}
              {editing && (
                <div style={styles.addInterestBox}>
                  <div style={styles.addInputRow}>
                    <input
                      type="text"
                      placeholder="Type a new interest (e.g. Photography)..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                      style={styles.addInput}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddInterest()}
                      style={styles.addBtn}
                    >
                      + Add
                    </button>
                  </div>

                  {/* Quick Suggestions */}
                  <div style={styles.suggestionsWrapper}>
                    <p style={styles.suggestionsLabel}>Suggested interests:</p>
                    <div style={styles.suggestionsRow}>
                      {SUGGESTED_INTERESTS.filter(
                        (s) => !form.passions.includes(s.toLowerCase())
                      )
                        .slice(0, 6)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleAddInterest(s)}
                            style={styles.suggestionChip}
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Community Stats Card */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <span style={{ ...styles.sectionBar, backgroundColor: '#0284c7' }} />
                <h3 style={styles.sectionTitle}>Community Snapshot</h3>
              </div>

              <div style={styles.statsList}>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Connected People</span>
                  <span style={styles.statValue}>{connections.length}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Active Interests</span>
                  <span style={styles.statValue}>{form.passions.length}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Local Hub</span>
                  <span style={styles.statValue}>
                    {user.location?.city || 'Mumbai'}
                  </span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Account Status</span>
                  <span style={{ ...styles.statValue, color: '#16a34a' }}>
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY PEOPLE (CONNECTIONS) ================= */}
      {activeTab === 'people' && (
        <div style={styles.peopleSection}>
          <div style={styles.peopleHeader}>
            <div>
              <h2 style={styles.peopleTitle}>My People</h2>
              <p style={styles.peopleSubtitle}>
                Kindred spirits you have connected with on PassionX.
              </p>
            </div>
            <Link to="/discover" style={styles.discoverMoreBtn}>
              + Find More People
            </Link>
          </div>

          {connections.length === 0 ? (
            <div style={styles.emptyPeopleCard}>
              <div style={styles.emptyIcon}>🤝</div>
              <h3 style={styles.emptyTitle}>You haven't connected with anyone yet</h3>
              <p style={styles.emptyText}>
                Explore the community directory to discover fellow creators, musicians,
                and thinkers in your city who share your passion.
              </p>
              <Link to="/discover" style={styles.exploreBtn}>
                Explore Discover People →
              </Link>
            </div>
          ) : (
            <div style={styles.peopleGrid}>
              {connections.map((c) => {
                const targetUser = typeof c === 'object' ? c : { _id: c, name: 'Member' };
                return (
                  <div key={targetUser._id} style={styles.connectedCard}>
                    <UserCard user={targetUser} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= PHOTO UPLOAD MODAL ================= */}
      {showPhotoModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Update Profile Photo</h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <p style={styles.modalSub}>
              Upload a photo from your computer or pick from our curated creative avatars.
            </p>

            {/* File Upload Option */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={styles.uploadLocalBtn}
            >
              📁 Choose Photo from Device
            </button>

            {/* Presets */}
            <div style={styles.presetsWrapper}>
              <p style={styles.presetsTitle}>Or choose a creative avatar:</p>
              <div style={styles.presetsGrid}>
                {AVATAR_PRESETS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Avatar preset ${i + 1}`}
                    onClick={() => handleSelectPresetAvatar(url)}
                    style={styles.presetImg}
                  />
                ))}
              </div>
            </div>

            {/* URL input */}
            <div style={styles.urlInputBox}>
              <input
                type="text"
                placeholder="Or paste an image URL..."
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                style={styles.urlInput}
              />
              <button
                onClick={() => setShowPhotoModal(false)}
                style={styles.applyUrlBtn}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2.5rem 1.5rem 5rem 1.5rem',
  },

  /* HEADER BANNER */
  headerCard: {
    position: 'relative',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  coverBanner: {
    height: 140,
    background:
      'linear-gradient(135deg, #bae6fd 0%, #bbf7d0 50%, #fed7aa 100%)',
  },
  headerContent: {
    padding: '0 2rem 1.5rem 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: '1.5rem',
    marginTop: -50,
  },
  avatarWrapper: {
    position: 'relative',
    width: 104,
    height: 104,
    borderRadius: '50%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    border: '4px solid #ffffff',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '2.2rem',
    fontWeight: 700,
  },
  photoUploadBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    border: '2px solid #ffffff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  mainInfo: {
    flex: 1,
    minWidth: 260,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  userName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.85rem',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  verifiedBadge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#0284c7',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    padding: '0.2rem 0.65rem',
    borderRadius: 12,
    border: '1px solid rgba(56, 189, 248, 0.25)',
  },
  userEmail: {
    fontSize: '0.88rem',
    color: '#64748b',
    marginTop: '0.15rem',
  },
  userLocation: {
    fontSize: '0.86rem',
    color: '#475569',
    fontWeight: 500,
    marginTop: '0.25rem',
  },
  headerActions: {
    marginLeft: 'auto',
  },
  editBtn: {
    padding: '0.6rem 1.4rem',
    borderRadius: 20,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
  },
  saveCancelRow: {
    display: 'flex',
    gap: '0.6rem',
  },
  saveBtn: {
    padding: '0.6rem 1.4rem',
    borderRadius: 20,
    backgroundColor: '#16a34a',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
  },
  cancelBtn: {
    padding: '0.6rem 1.2rem',
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '0.88rem',
    fontWeight: 500,
    cursor: 'pointer',
  },

  /* TABS */
  tabsRow: {
    display: 'flex',
    borderTop: '1px solid rgba(226, 232, 240, 0.8)',
    padding: '0 1.5rem',
    backgroundColor: '#FAF8F5',
  },
  tabBtn: {
    padding: '1rem 1.5rem',
    fontSize: '0.94rem',
    fontWeight: 500,
    color: '#64748b',
    backgroundColor: 'transparent',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    color: '#0f172a',
    fontWeight: 600,
    borderBottom: '2px solid #0f172a',
    backgroundColor: '#ffffff',
  },

  /* LAYOUT */
  profileLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.75rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },

  /* SECTION CARDS */
  sectionCard: {
    padding: '1.8rem',
    borderRadius: 22,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.85)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '1rem',
  },
  sectionBar: {
    width: 3.5,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#0284c7',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  aboutText: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#475569',
  },
  textarea: {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: 14,
    border: '1px solid rgba(203, 213, 225, 0.8)',
    fontSize: '0.92rem',
    color: '#1e293b',
    lineHeight: 1.6,
    backgroundColor: '#FAF8F5',
    resize: 'vertical',
    outline: 'none',
  },
  locationInputsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem',
  },
  input: {
    padding: '0.65rem 1rem',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.8)',
    fontSize: '0.9rem',
    color: '#1e293b',
    backgroundColor: '#FAF8F5',
  },

  /* INTERESTS */
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  passionTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.95rem',
    borderRadius: 50,
    fontSize: '0.84rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  tagRemoveBtn: {
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
  },
  emptyTagsNotice: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  addInterestBox: {
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(241, 245, 249, 0.9)',
  },
  addInputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  addInput: {
    flex: 1,
    padding: '0.6rem 0.9rem',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.8)',
    fontSize: '0.88rem',
    backgroundColor: '#FAF8F5',
  },
  addBtn: {
    padding: '0.6rem 1.1rem',
    borderRadius: 12,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  suggestionsWrapper: {
    marginTop: '0.5rem',
  },
  suggestionsLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#64748b',
    marginBottom: '0.4rem',
  },
  suggestionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  suggestionChip: {
    padding: '0.25rem 0.65rem',
    borderRadius: 14,
    fontSize: '0.76rem',
    fontWeight: 500,
    backgroundColor: '#f1f5f9',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  /* STATS LIST */
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(241, 245, 249, 0.9)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  statValue: {
    fontSize: '0.92rem',
    fontWeight: 600,
    color: '#0f172a',
  },

  /* MY PEOPLE TAB */
  peopleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  peopleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  peopleTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  peopleSubtitle: {
    fontSize: '0.92rem',
    color: '#64748b',
  },
  discoverMoreBtn: {
    padding: '0.6rem 1.3rem',
    borderRadius: 20,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: 600,
  },
  peopleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  connectedCard: {},
  emptyPeopleCard: {
    padding: '5rem 2rem',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    textAlign: 'center',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.35rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '0.95rem',
    color: '#64748b',
    maxWidth: 480,
    margin: '0 auto 1.75rem auto',
    lineHeight: 1.6,
  },
  exploreBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.8rem',
    borderRadius: 24,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.92rem',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
  },

  /* MODAL */
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: '2rem',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    fontSize: '1.1rem',
    color: '#64748b',
    cursor: 'pointer',
  },
  modalSub: {
    fontSize: '0.88rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  uploadLocalBtn: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 14,
    border: '2px dashed rgba(56, 189, 248, 0.5)',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    color: '#0284c7',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'all 0.2s ease',
  },
  presetsWrapper: {
    marginBottom: '1.5rem',
  },
  presetsTitle: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '0.75rem',
  },
  presetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0.6rem',
  },
  presetImg: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  urlInputBox: {
    display: 'flex',
    gap: '0.5rem',
  },
  urlInput: {
    flex: 1,
    padding: '0.6rem 0.9rem',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.8)',
    fontSize: '0.85rem',
  },
  applyUrlBtn: {
    padding: '0.6rem 1rem',
    borderRadius: 12,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorBanner: {
    padding: '0.8rem 1.2rem',
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#dc2626',
    fontSize: '0.88rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
};

export default Profile;
