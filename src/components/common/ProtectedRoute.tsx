import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required roles (if specified)
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
