import { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassLogin } from '@/components/ui/liquid-glass-login';

const Auth = () => {
  const { user, login, register } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    } else if (searchParams.get('mode') === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  const targetPath = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/discover';

  if (user) return <Navigate to={targetPath} replace />;

  const handleSubmit = async (values) => {
    setError('');
    try {
      if (isLogin) {
        await login(values.email, values.password);
      } else {
        const passions = (values.passions || '')
          .split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean);
        await register(
          values.name || 'Anonymous',
          values.email,
          values.password,
          passions,
          {
            city: values.city || '',
            state: values.state || '',
          },
          values.role || 'user'
        );
      }
    } catch (err) {
      let msg = isLogin
        ? 'Sign-in failed. Please check your email and password.'
        : 'Registration failed. Please check your information.';

      if (err.response?.data?.errors) {
        msg = typeof err.response.data.errors === 'object'
          ? Object.values(err.response.data.errors).join(' ')
          : String(err.response.data.errors);
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        msg = 'Cannot connect to backend server. Please make sure the server is running on port 5001.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      throw err;
    }
  };

  const handleToggle = () => {
    setError('');
    const nextMode = isLogin ? 'signup' : 'login';
    setIsLogin(!isLogin);
    setSearchParams({ mode: nextMode });
  };

  return (
    <GlassLogin
      isSignUp={!isLogin}
      onToggleMode={handleToggle}
      error={error}
      onSubmit={handleSubmit}
      onProviderSignIn={async (provider) => {
        setError(`Social sign-in with ${provider} will be available in the next release.`);
      }}
    >
      {/* Background watermark behind draggable glass */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[12px] text-white/50 [text-shadow:0_1px_4px_rgb(0_0_0/0.8)]">
        <span>PassionX • Your passion, your people, all at one place.</span>
      </div>
    </GlassLogin>
  );
};

export default Auth;
