import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const styles = {
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(135, 206, 235, 0.3)',
    borderTop: '3px solid #87CEEB',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

export default ProtectedRoute;
