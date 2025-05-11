import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Check token validity on route access
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('incentive_token');

      if (token) {
        try {
          // Decode token to check expiration
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Math.floor(Date.now() / 1000);

          // If token is expired or about to expire (within 5 minutes)
          if (decoded.exp < currentTime + 300) {
            // Try to refresh the token
            await authService.refreshToken();
          }
        } catch (error) {
          console.error('Error checking token validity:', error);
        }
      }
    };

    checkTokenValidity();
  }, []);

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
