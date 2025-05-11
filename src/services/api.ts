import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // We'll use mock data instead of real API calls
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('incentive_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as any;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = window.localStorage.getItem('incentive_refreshToken');
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });

        if (response.data.success) {
          const { token, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens in localStorage
          window.localStorage.setItem('incentive_token', token);
          window.localStorage.setItem('incentive_refreshToken', newRefreshToken);
          window.localStorage.setItem('incentive_lastLogin', new Date().toISOString());

          // Update Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.localStorage.removeItem('incentive_token');
        window.localStorage.removeItem('incentive_refreshToken');
        window.localStorage.removeItem('incentive_lastLogin');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: async (email: string, password: string) => {
    // Simple mock login - always succeeds with any email/password
    const mockUser = {
      userId: '123',
      email: email || 'user@example.com',
      roles: ['User']
    };

    const mockToken = 'mock-jwt-token';
    const mockRefreshToken = 'mock-refresh-token';

    // Store in localStorage
    window.localStorage.setItem('incentive_token', mockToken);
    window.localStorage.setItem('incentive_refreshToken', mockRefreshToken);
    window.localStorage.setItem('incentive_user', JSON.stringify(mockUser));
    window.localStorage.setItem('incentive_lastLogin', new Date().toISOString());

    // Return success response
    return {
      success: true,
      data: {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user: mockUser
      }
    };
  },
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    try {
      // No need to call API for mock data
      console.log('Logging out user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      window.localStorage.removeItem('incentive_token');
      window.localStorage.removeItem('incentive_refreshToken');
      window.localStorage.removeItem('incentive_user');
      window.localStorage.removeItem('incentive_lastLogin');
    }

    // Return mock success response
    return { success: true };
  },
  refreshToken: async () => {
    const refreshToken = window.localStorage.getItem('incentive_refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Mock successful refresh response
    const mockResponse = {
      success: true,
      data: {
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token'
      }
    };

    // Update tokens in localStorage
    window.localStorage.setItem('incentive_token', mockResponse.data.token);
    window.localStorage.setItem('incentive_refreshToken', mockResponse.data.refreshToken);
    window.localStorage.setItem('incentive_lastLogin', new Date().toISOString());

    return mockResponse;
  },
  getCurrentUser: async () => {
    // Get user from localStorage or return default
    const storedUser = window.localStorage.getItem('incentive_user');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          success: true,
          data: userData
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    // Default user if none found
    const defaultUser = {
      userId: '123',
      email: 'user@example.com',
      roles: ['User']
    };

    // Store default user
    window.localStorage.setItem('incentive_user', JSON.stringify(defaultUser));

    return {
      success: true,
      data: defaultUser
    };
  }
};

export const incentiveRulesService = {
  getAll: async (pageNumber = 1, pageSize = 10) => {
    const response = await api.get(`/api/incentive-rules?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/incentive-rules/${id}`);
    return response.data;
  },
  create: async (ruleData: any) => {
    const response = await api.post('/api/incentive-rules', ruleData);
    return response.data;
  },
  update: async (id: string, ruleData: any) => {
    const response = await api.put(`/api/incentive-rules/${id}`, ruleData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/incentive-rules/${id}`);
    return response.data;
  },
};

export const dealsService = {
  getAll: async (pageNumber = 1, pageSize = 10, status?: string) => {
    let url = `/api/deals?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/deals/${id}`);
    return response.data;
  },
  create: async (dealData: any) => {
    const response = await api.post('/api/deals', dealData);
    return response.data;
  },
  update: async (id: string, dealData: any) => {
    const response = await api.put(`/api/deals/${id}`, dealData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/deals/${id}`);
    return response.data;
  },
  addActivity: async (dealId: string, activityData: any) => {
    const response = await api.post(`/api/deals/${dealId}/activities`, activityData);
    return response.data;
  },
};

export const paymentsService = {
  getAll: async (pageNumber = 1, pageSize = 10, status?: string) => {
    let url = `/api/payments?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
  },
  create: async (paymentData: any) => {
    const response = await api.post('/api/payments', paymentData);
    return response.data;
  },
  update: async (id: string, paymentData: any) => {
    const response = await api.put(`/api/payments/${id}`, paymentData);
    return response.data;
  },
};

export const workflowsService = {
  getAll: async () => {
    const response = await api.get('/api/workflows');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/workflows/${id}`);
    return response.data;
  },
  create: async (workflowData: any) => {
    const response = await api.post('/api/workflows', workflowData);
    return response.data;
  },
  update: async (id: string, workflowData: any) => {
    const response = await api.put(`/api/workflows/${id}`, workflowData);
    return response.data;
  },
};

export default api;
