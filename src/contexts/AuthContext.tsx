import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: string;
  email: string;
  roles: string[];
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if token is expired or about to expire
  const isTokenExpired = (token: string, bufferSeconds = 60) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Return true if token is expired or will expire within buffer time
      return decoded.exp < currentTime + bufferSeconds;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume token is expired if we can't decode it
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const currentToken = window.localStorage.getItem('incentive_token');

      // Only refresh if we have a token and it's expired or about to expire
      if (currentToken && isTokenExpired(currentToken)) {
        console.log('Token is expired or about to expire, refreshing...');

        const response = await authService.refreshToken();

        if (response.success && response.data) {
          setToken(response.data.token);
          setUser(response.data.user);
          return true;
        } else {
          // If refresh fails, log out
          logout();
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  // Setup token refresh interval
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      window.clearInterval(refreshTimerRef.current);
    }

    // Only set up refresh timer if we have a token
    if (token) {
      // Check token every minute
      refreshTimerRef.current = window.setInterval(() => {
        refreshToken();
      }, 60000); // 1 minute
    }

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        window.clearInterval(refreshTimerRef.current);
      }
    };
  }, [token]);

  // Simplified login function
  const login = async (username: string, password: string) => {
    console.log('AuthContext login function called with username:', username);
    try {
      // Call the real login service
      console.log('Calling authService.login');
      const response = await authService.login(username, password);
      console.log('authService.login response:', response);

      // Update state with user data
      if (response.success && response.data) {
        console.log('Login successful, setting token and user');
        setToken(response.data.token);
        setUser(response.data.user);

        // Navigate to dashboard
        console.log('Navigating to dashboard');
        navigate('/dashboard');
        return true;
      }
      console.log('Login failed, response:', response);
      return false;
    } catch (error) {
      console.error('Error during login in AuthContext:', error);
      throw error; // Re-throw the error so it can be caught in the Login component
    }
  };

  // Simplified logout function
  const logout = () => {
    // Clear localStorage
    window.localStorage.removeItem('incentive_token');
    window.localStorage.removeItem('incentive_refreshToken');
    window.localStorage.removeItem('incentive_user');
    window.localStorage.removeItem('incentive_lastLogin');

    // Update state
    setToken(null);
    setUser(null);

    // Navigate to login
    navigate('/login');
  };

  // Function to clear auth data (used internally to avoid circular dependencies)
  const clearAuthData = () => {
    window.localStorage.removeItem('incentive_token');
    window.localStorage.removeItem('incentive_user');
    window.localStorage.removeItem('incentive_lastLogin');
    setToken(null);
    setUser(null);
  };

  // Check if user is already logged in and token is valid
  useEffect(() => {
    const storedToken = window.localStorage.getItem('incentive_token');
    const storedUser = window.localStorage.getItem('incentive_user');

    if (storedToken && storedUser) {
      try {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          // Try to refresh the token
          refreshToken().then(success => {
            if (!success && location.pathname !== '/login') {
              navigate('/login');
            }
          });
        } else {
          // Parse the user data
          const userData = JSON.parse(storedUser);

          // Set the token and user in state
          setToken(storedToken);
          setUser(userData);

          // If we're on the login page, redirect to dashboard
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuthData();

        // If not on login page, redirect to login
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    } else if (location.pathname !== '/login') {
      // No token and not on login page, redirect to login
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
