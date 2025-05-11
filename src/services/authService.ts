import apiClient from './apiClient';
import localStorageService from './localStorageService';

interface LoginResponse {
  token: string;
  refreshToken: string;
  userId?: string;
  email?: string;
  roles?: string[];
}

interface User {
  userId: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken?: string;
    user: User;
  };
  error?: string;
}

const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with username from form:', { username });

      // Use the username and password from the form
      const loginData = {
        userName: username,
        password: password
      };

      console.log('Making API call to /Auth/login with form data');
      const response = await apiClient.post<LoginResponse>('/Auth/login', loginData);

      console.log('Login API response:', response);

      // Extract token from response
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Create user object from response
      const user: User = {
        userId: response.data.userId || '123',
        email: username,
        roles: response.data.roles || ['User']
      };

      // Store in localStorage using our service
      localStorageService.setAuthToken(token);
      localStorageService.setRefreshToken(refreshToken);
      localStorageService.setUserData(user);
      localStorageService.setLastLogin();

      // Return success response
      return {
        success: true,
        data: {
          token: token,
          refreshToken: refreshToken,
          user: user
        }
      };
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = localStorageService.getRefreshToken();
      const token = localStorageService.getAuthToken();

      if (!refreshToken || !token) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<LoginResponse>('/Auth/refresh-token', {
        token: token,
        refreshToken: refreshToken
      });

      if (response.data) {
        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        // Update tokens in localStorage using our service
        localStorageService.setAuthToken(newToken);
        localStorageService.setRefreshToken(newRefreshToken);
        localStorageService.setLastLogin();

        // Get current user from localStorage
        const user = localStorageService.getUserData() || { userId: '123', email: 'user@example.com', roles: ['User'] };

        return {
          success: true,
          data: {
            token: newToken,
            refreshToken: newRefreshToken,
            user: user
          }
        };
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Token refresh failed'
      };
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      // Clear local storage using our service
      localStorageService.clearAuthData();

      // Return success response
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      // Get user from localStorage using our service
      const userData = localStorageService.getUserData();

      if (userData) {
        return {
          success: true,
          data: {
            token: localStorageService.getAuthToken() || '',
            user: userData
          }
        };
      }

      throw new Error('No user found');
    } catch (error: any) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }
};

export default authService;
