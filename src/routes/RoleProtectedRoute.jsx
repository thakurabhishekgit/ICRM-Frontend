import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';
import { getDashboardPath, normalizeRole } from '../utils/roleRoutes';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading your workspace..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeRole(user.role);
  const hasAccess = allowedRoles.some((role) => normalizeRole(role) === userRole);

  if (!hasAccess) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
