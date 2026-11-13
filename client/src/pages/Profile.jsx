import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PASSION_COLORS = [
  { bg: 'rgba(56, 189, 248, 0.12)', color: '#0284c7' },
  { bg: 'rgba(134, 239, 172, 0.18)', color: '#15803d' },
  { bg: 'rgba(253, 186, 116, 0.18)', color: '#c2410c' },
  { bg: 'rgba(196, 181, 253, 0.18)', color: '#7c3aed' },
  { bg: 'rgba(252, 165, 165, 0.15)', color: '#dc2626' },
  { bg: 'rgba(253, 224, 71, 0.18)', color: '#a16207' },
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
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    passions: user?.passions || [],
    city: user?.location?.city || '',
    state: user?.location?.state || '',
  });
  const [newPassion, setNewPassion] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPassion = () => {
    const p = newPassion.trim().toLowerCase();
    if (p && !form.passions.includes(p)) {
      setForm({ ...form, passions: [...form.passions, p] });
    }
    setNewPassion('');
  };

  const removePassion = (passion) => {
    setForm({ ...form, passions: form.passions.filter((p) => p !== passion) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPassion();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        passions: form.passions,
        location: { city: form.city, state: form.state },
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
      passions: user?.passions || [],
      city: user?.location?.city || '',
      state: user?.location?.state || '',
    });
    setEditing(false);
    setError('');
  };

  if (!user) return null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            <span style={styles.initials}>{getInitials(user.name)}</span>
          </div>
          {!editing && (
            <div>
              <h1 style={styles.displayName}>{user.name}</h1>
              <p style={styles.email}>{user.email}</p>
            </div>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {editing ? (
          <div style={styles.form}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />

            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell people about yourself…"
              style={{ ...styles.input, resize: 'vertical', minHeight: 70 }}
            />

            <label style={styles.label}>Passions</label>
            <div style={styles.passionTags}>
              {form.passions.map((p) => {
                const c = getPassionColor(p);
                return (
                  <span key={p} style={{ ...styles.tag, backgroundColor: c.bg, color: c.color }}>
                    {p}
                    <span onClick={() => removePassion(p)} style={styles.removeTag}>
                      ×
                    </span>
                  </span>
                );
              })}
            </div>
            <div style={styles.addPassionRow}>
              <input
                type="text"
                value={newPassion}
                onChange={(e) => setNewPassion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a passion…"
                style={{ ...styles.input, flex: 1 }}
              />
              <button type="button" onClick={addPassion} style={styles.addBtn}>
                Add
              </button>
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={handleCancel} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.details}>
            {user.bio && <p style={styles.bio}>{user.bio}</p>}

            {user.passions?.length > 0 && (
              <div>
                <label style={styles.label}>Passions</label>
                <div style={styles.passionTags}>
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
              </div>
            )}

            {(user.location?.city || user.location?.state) && (
              <p style={styles.location}>
                📍 {[user.location.city, user.location.state].filter(Boolean).join(', ')}
              </p>
            )}

            <button onClick={() => setEditing(true)} style={styles.editBtn}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    borderRadius: 24,
    padding: '2.2rem',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.06)',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #38bdf8, #86efac)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    letterSpacing: '0.04em',
  },
  displayName: {
    fontSize: '1.35rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  email: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: 300,
  },
  error: {
    fontSize: '0.82rem',
    color: '#dc2626',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    padding: '0.5rem 0.8rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '-0.3rem',
  },
  input: {
    padding: '0.65rem 0.85rem',
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#1e293b',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    transition: 'border-color 0.3s ease',
    outline: 'none',
    width: '100%',
  },
  row: {
    display: 'flex',
    gap: '0.75rem',
  },
  passionTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  tag: {
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '0.3rem 0.7rem',
    borderRadius: 50,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  removeTag: {
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    lineHeight: 1,
    opacity: 0.6,
  },
  addPassionRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  addBtn: {
    padding: '0.6rem 1rem',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#0284c7',
    background: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.7rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#64748b',
    background: 'rgba(148, 163, 184, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  saveBtn: {
    flex: 1,
    padding: '0.7rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #38bdf8, #86efac)',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  bio: {
    fontSize: '0.92rem',
    color: '#475569',
    fontWeight: 300,
    lineHeight: 1.6,
  },
  location: {
    fontSize: '0.88rem',
    color: '#64748b',
    fontWeight: 400,
  },
  editBtn: {
    alignSelf: 'flex-start',
    padding: '0.6rem 1.4rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: '#0f172a',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.3rem',
  },
};

export default Profile;
