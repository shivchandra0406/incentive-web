/**
 * Local Storage Service
 * Provides methods to store, retrieve, and remove data from local storage
 */

// Store data in local storage
export const setItem = (key: string, value: any): void => {
  try {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error storing data in local storage:', error);
  }
};

// Get data from local storage
export const getItem = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    // Try to parse as JSON, if it fails return the raw value
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error('Error retrieving data from local storage:', error);
    return null;
  }
};

// Remove data from local storage
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data from local storage:', error);
  }
};

// Clear all data from local storage
export const clearAll = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};

// Store user data in local storage
export const setUserData = (userData: any): void => {
  setItem('incentive_user', userData);
};

// Get user data from local storage
export const getUserData = (): any => {
  return getItem('incentive_user');
};

// Store auth token in local storage
export const setAuthToken = (token: string): void => {
  setItem('incentive_token', token);
};

// Get auth token from local storage
export const getAuthToken = (): string | null => {
  return getItem('incentive_token');
};

// Store refresh token in local storage
export const setRefreshToken = (token: string): void => {
  setItem('incentive_refreshToken', token);
};

// Get refresh token from local storage
export const getRefreshToken = (): string | null => {
  return getItem('incentive_refreshToken');
};

// Set last login timestamp
export const setLastLogin = (): void => {
  setItem('incentive_lastLogin', new Date().toISOString());
};

// Get last login timestamp
export const getLastLogin = (): string | null => {
  return getItem('incentive_lastLogin');
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeItem('incentive_token');
  removeItem('incentive_refreshToken');
  removeItem('incentive_user');
  removeItem('incentive_lastLogin');
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  setUserData,
  getUserData,
  setAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  setLastLogin,
  getLastLogin,
  clearAuthData
};
