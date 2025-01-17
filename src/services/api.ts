import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://healthcareclinic-management.netlify.app/.netlify/functions/api'
  : 'http://localhost:5000/.netlify/functions/api';

console.log('API URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      return Promise.reject(new Error(error.response.data.message || 'Authentication failed'));
    }
    
    // Network error or server not responding
    if (!error.response) {
      console.error('Network error or server not responding');
      return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
    }

    return Promise.reject(new Error(error.response.data.message || 'An error occurred'));
  }
);

// API Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/auth/login', { 
        email: email.trim(),
        password: password.trim()
      });
      console.log('Login successful:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const appointmentService = {
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export const patientService = {
  create: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/patients/search?query=${query}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  update: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
  addMedicalRecord: async (id: string, recordData: any) => {
    const response = await api.post(`/patients/${id}/medical-records`, recordData);
    return response.data;
  },
};

export const paymentService = {
  create: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  getReport: async (params: any) => {
    const response = await api.get('/payments/report', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },
};

export const paymentGatewayService = {
  createStripePayment: async (paymentData: any) => {
    const response = await api.post('/payment-gateway/stripe/create-payment', paymentData);
    return response.data;
  },
  createRazorpayPayment: async (paymentData: any) => {
    const response = await api.post('/payment-gateway/razorpay/create-payment', paymentData);
    return response.data;
  },
  verifyRazorpayPayment: async (verificationData: any) => {
    const response = await api.post('/payment-gateway/razorpay/verify-payment', verificationData);
    return response.data;
  },
};

export default api; 