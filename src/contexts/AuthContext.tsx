import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

interface User {
  userId: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Simplified login function
  const login = async (email: string, password: string) => {
    try {
      // Call the mock login service
      const response = await authService.login(email, password);

      // Update state with user data
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);

        // Navigate to dashboard
        navigate('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
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

  // Simple check if user is already logged in
  useEffect(() => {
    const storedToken = window.localStorage.getItem('incentive_token');
    const storedUser = window.localStorage.getItem('incentive_user');

    if (storedToken && storedUser) {
      try {
        // Parse the user data
        const userData = JSON.parse(storedUser);

        // Set the token and user in state
        setToken(storedToken);
        setUser(userData);

        // If we're on the login page, redirect to dashboard
        if (location.pathname === '/login') {
          navigate('/dashboard');
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
