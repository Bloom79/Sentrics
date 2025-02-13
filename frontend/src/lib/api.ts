import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Custom error handling
export class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.clear();
      window.location.href = '/auth';
      return Promise.reject(error);
    }
    
    if (error.response) {
      // Transform API errors into a consistent format
      throw new ApiError(error.response.status, error.response.data);
    } else if (error.request) {
      // Network or request error
      throw new ApiError(0, { message: 'Network error - no response received' });
    } else {
      // Something happened in setting up the request
      throw new ApiError(0, { message: error.message });
    }
  }
);

// Add request interceptor for auth
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    const tokenType = localStorage.getItem('auth_token_type') || 'Bearer';
    
    if (token && config.headers) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }

    // Special handling for login endpoint
    if (config.url?.includes('/login/access-token')) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    // Log request configuration
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      withCredentials: config.withCredentials
    });

    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const endpoints = {
  auth: {
    login: '/api/v1/login/access-token',
    me: '/api/v1/app-users/me',
  },
  users: {
    base: '/api/v1/app-users',
    list: () => '/api/v1/app-users',
    details: (id: string) => `/api/v1/app-users/${id}`,
  },
  cer: {
    base: '/api/cer',
    list: () => '/api/cer',
    details: (id: string) => `/api/cer/${id}`,
    communities: {
      list: () => '/api/cer/communities',
      details: (id: string) => `/api/cer/communities/${id}`,
      members: (id: string) => `/api/cer/communities/${id}/members`,
      billing: (id: string) => `/api/cer/communities/${id}/billing`,
      compliance: (id: string) => `/api/cer/communities/${id}/compliance`,
    }
  },
  communities: {
    base: '/api/cer/communities',
    list: () => '/api/cer/communities',
    details: (id: string) => `/api/cer/communities/${id}`,
    members: (id: string) => `/api/cer/communities/${id}/members`,
    billing: (id: string) => `/api/cer/communities/${id}/billing`,
    compliance: (id: string) => `/api/cer/communities/${id}/compliance`,
  },
  configurations: {
    base: '/api/v1/configurations/',
    list: () => '/api/v1/configurations/',
    details: (id: string) => `/api/v1/configurations/${id}/`,
  },
  billing: {
    base: '/api/billing',
    list: () => '/api/billing',
    details: (id: string) => `/api/billing/${id}`,
  },
  tide: {
    base: '/api/tide',
    list: () => '/api/tide',
    compliance: (id: string) => `/api/tide/${id}/compliance`,
  },
};