import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';
import { getDashboardPath } from '../utils/roleRoutes';

/** Public pages (login, register) — redirect authenticated users to home in dashboard. */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading..." />;
  }

  if (isAuthenticated && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

/** Unknown routes — send guests to landing, authenticated users to dashboard. */
export const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading..." />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Navigate to="/" replace />;
};

export default GuestRoute;
