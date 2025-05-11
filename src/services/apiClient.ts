import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import localStorageService from './localStorageService';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://localhost:44307/api', // Real API endpoint using HTTPS
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'shiv', // Adding the tenant ID header
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAuthToken();
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
        // Try to refresh the token using our service
        const refreshToken = localStorageService.getRefreshToken();
        const token = localStorageService.getAuthToken();

        if (!refreshToken || !token) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          'https://localhost:44307/api/Auth/refresh-token',
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

          // Update tokens in localStorage using our service
          localStorageService.setAuthToken(newToken);
          localStorageService.setRefreshToken(newRefreshToken);
          localStorageService.setLastLogin();

          // Update Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorageService.clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
