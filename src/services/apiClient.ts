import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:44307/api', // Real API endpoint (using HTTP to avoid SSL issues)
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'shiv', // Adding the tenant ID header
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = window.localStorage.getItem('incentive_refreshToken');
        const token = window.localStorage.getItem('incentive_token');

        if (!refreshToken || !token) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          'http://localhost:44307/api/Auth/refresh-token',
          {
            token: token,
            refreshToken: refreshToken
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Tenant-ID': 'shiv'
            }
          }
        );

        if (response.data) {
          const newToken = response.data.token || response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          // Update tokens in localStorage
          window.localStorage.setItem('incentive_token', newToken);
          window.localStorage.setItem('incentive_refreshToken', newRefreshToken);
          window.localStorage.setItem('incentive_lastLogin', new Date().toISOString());

          // Update Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.localStorage.removeItem('incentive_token');
        window.localStorage.removeItem('incentive_refreshToken');
        window.localStorage.removeItem('incentive_user');
        window.localStorage.removeItem('incentive_lastLogin');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
