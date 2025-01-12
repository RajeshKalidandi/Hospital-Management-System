import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://hospital-management-system-backend.vercel.app/api'
  : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
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