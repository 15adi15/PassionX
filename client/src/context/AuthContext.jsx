import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, passions, location) => {
    const { data } = await API.post('/auth/register', {
      name,
      email,
      password,
      passions,
      location,
    });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/users/profile', profileData);
    setUser(data);
    return data;
  };

  const connectUser = async (targetUserId) => {
    const { data } = await API.post(`/users/connect/${targetUserId}`);
    setUser(data);
    return data;
  };

  const disconnectUser = async (targetUserId) => {
    const { data } = await API.post(`/users/disconnect/${targetUserId}`);
    setUser(data);
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
      return data;
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        connectUser,
        disconnectUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
