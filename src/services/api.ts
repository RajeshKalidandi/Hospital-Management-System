import axios, { AxiosError, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error('Response error:', error);

    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helper to handle API errors
const handleApiError = (error: any): never => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error('An unexpected error occurred.');
};

// Types
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  message: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Auth service
const auth = {
  async login(email: string, password: string): Promise<User> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw handleApiError(error);
    }
  },

  async verifyToken(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await api.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  logout(): void {
    try {
      // Call logout endpoint
      api.post('/auth/logout').catch(console.error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

// Export the auth service
export { auth };
export default api; 