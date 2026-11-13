import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import './App.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={spinnerStyle} />
      </div>
    );
  }

  const isBoxed = location.pathname === '/discover' || location.pathname === '/profile';

  return (
    <div className="app-container">
      <Navbar />
      <main className={`page-content ${isBoxed ? 'page-content-boxed' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/discover" replace /> : <Auth />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const spinnerStyle = {
  width: 40,
  height: 40,
  border: '3px solid rgba(135, 206, 235, 0.3)',
  borderTop: '3px solid #38bdf8',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

export default App;
