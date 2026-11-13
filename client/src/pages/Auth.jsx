import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passions: '',
    city: '',
    state: '',
  });

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        const passions = form.passions
          .split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean);
        await register(form.name, form.email, form.password, passions, {
          city: form.city,
          state: form.state,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div style={styles.wrapper}>
      {/* Decorative floating orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.brand}>
            <span style={styles.brandIcon}>✦</span> PassionX
          </h1>
          <p style={styles.tagline}>Your People. Your Passion. All in One Place.</p>
        </div>

        <h2 style={styles.title}>{isLogin ? 'Welcome back' : 'Create your account'}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            style={styles.input}
          />

          {!isLogin && (
            <>
              <input
                type="text"
                name="passions"
                placeholder="Passions (comma-separated, e.g. music, dance)"
                value={form.passions}
                onChange={handleChange}
                style={styles.input}
              />
              <div style={styles.row}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  style={{ ...styles.input, flex: 1 }}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  style={{ ...styles.input, flex: 1 }}
                />
              </div>
            </>
          )}

          <button type="submit" disabled={submitting} style={styles.btn}>
            {submitting
              ? 'Please wait…'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={toggle} style={styles.toggleLink}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  /* Floating decorative orbs */
  orb1: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
    top: '-5%',
    left: '-8%',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(134,239,172,0.25) 0%, transparent 70%)',
    bottom: '5%',
    right: '-5%',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(253,186,116,0.2) 0%, transparent 70%)',
    top: '40%',
    right: '20%',
    filter: 'blur(35px)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 420,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    padding: '2.5rem 2rem',
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.08), 0 2px 12px rgba(0, 0, 0, 0.04)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  brand: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.03em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  },
  brandIcon: {
    fontSize: '1.4rem',
    color: '#38bdf8',
  },
  tagline: {
    fontSize: '0.82rem',
    color: '#64748b',
    fontWeight: 300,
    marginTop: '0.35rem',
    letterSpacing: '0.01em',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 500,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '1.2rem',
  },
  error: {
    fontSize: '0.82rem',
    color: '#dc2626',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    padding: '0.55rem 0.9rem',
    marginBottom: '0.8rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.7rem 0.9rem',
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#1e293b',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
  row: {
    display: 'flex',
    gap: '0.75rem',
  },
  btn: {
    marginTop: '0.4rem',
    padding: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #38bdf8 0%, #86efac 100%)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 16px rgba(56, 189, 248, 0.25)',
    letterSpacing: '0.01em',
  },
  toggle: {
    textAlign: 'center',
    fontSize: '0.82rem',
    color: '#64748b',
    marginTop: '1.2rem',
    fontWeight: 400,
  },
  toggleLink: {
    color: '#0ea5e9',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
};

export default Auth;
