import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://localhost:44307/api', // Real API endpoint
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'shiv', // Adding the tenant ID header
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
    try {
      // Call the real login API
      const response = await api.post('/Auth/login', {
        userName: email, // Using email as username
        password: password
      });

      // Extract token from response
      const token = response.data.token || response.data.accessToken;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Create user object from response
      const user = {
        userId: response.data.userId || '123',
        email: email,
        roles: response.data.roles || ['User']
      };

      // Store in localStorage
      window.localStorage.setItem('incentive_token', token);
      window.localStorage.setItem('incentive_user', JSON.stringify(user));
      window.localStorage.setItem('incentive_lastLogin', new Date().toISOString());

      // Return success response
      return {
        success: true,
        data: {
          token: token,
          user: user
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
  // Mock data for incentive rules
  mockRules: [
    {
      id: '1',
      name: 'Q2 Sales Target',
      type: 'Target',
      description: 'Quarterly sales target incentive',
      status: 'Active',
      createdBy: 'John Smith',
      createdAt: '2023-04-01T10:00:00Z',
    },
    {
      id: '2',
      name: 'Enterprise Deal Tiers',
      type: 'Tier',
      description: 'Tiered incentives for enterprise deals',
      status: 'Active',
      createdBy: 'Jane Doe',
      createdAt: '2023-03-15T14:30:00Z',
    },
    {
      id: '3',
      name: 'Healthcare Project Bonus',
      type: 'Project',
      description: 'Special incentives for healthcare industry projects',
      status: 'Active',
      createdBy: 'John Smith',
      createdAt: '2023-02-20T09:15:00Z',
    },
    {
      id: '4',
      name: 'APAC Region Bonus',
      type: 'Location',
      description: 'Location-based incentives for APAC region',
      status: 'Inactive',
      createdBy: 'Mike Johnson',
      createdAt: '2023-01-10T11:45:00Z',
    },
    {
      id: '5',
      name: 'Sales Team Collaboration',
      type: 'Team',
      description: 'Team-based incentives for collaborative sales',
      status: 'Active',
      createdBy: 'Sarah Williams',
      createdAt: '2023-05-05T16:20:00Z',
    },
  ],

  getAll: async (pageNumber = 1, pageSize = 10) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = incentiveRulesService.mockRules.slice(startIndex, endIndex);

    // Return mock paginated response
    return {
      success: true,
      data: {
        items: paginatedItems,
        totalCount: incentiveRulesService.mockRules.length,
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(incentiveRulesService.mockRules.length / pageSize)
      }
    };
  },

  getById: async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find rule by ID
    const rule = incentiveRulesService.mockRules.find(r => r.id === id);

    if (rule) {
      return {
        success: true,
        data: rule
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
  },

  create: async (ruleData: any) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));

    // Create new rule with ID and timestamps
    const newRule = {
      id: (incentiveRulesService.mockRules.length + 1).toString(),
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data
    incentiveRulesService.mockRules.push(newRule);

    return {
      success: true,
      data: newRule
    };
  },

  update: async (id: string, ruleData: any) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Find rule index
    const index = incentiveRulesService.mockRules.findIndex(r => r.id === id);

    if (index !== -1) {
      // Update rule
      const updatedRule = {
        ...incentiveRulesService.mockRules[index],
        ...ruleData,
        updatedAt: new Date().toISOString()
      };

      incentiveRulesService.mockRules[index] = updatedRule;

      return {
        success: true,
        data: updatedRule
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
  },

  delete: async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find rule index
    const index = incentiveRulesService.mockRules.findIndex(r => r.id === id);

    if (index !== -1) {
      // Remove rule
      incentiveRulesService.mockRules.splice(index, 1);

      return {
        success: true,
        message: 'Incentive rule deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
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
