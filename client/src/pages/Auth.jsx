import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassLogin } from '@/components/ui/liquid-glass-login';

const Auth = () => {
  const { user, login, register } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    } else if (searchParams.get('mode') === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  if (user) return <Navigate to="/discover" replace />;

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
          }
        );
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed. Please check your credentials.';
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
