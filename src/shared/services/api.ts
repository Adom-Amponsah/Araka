import axios from 'axios';
import {useAppStore} from '@shared/store/appStore';

const API_BASE_URL = 'https://api.araka.com/v1'; // TODO: Use react-native-config

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // TODO: Implement token refresh
      // const refreshToken = useAuthStore.getState().refreshToken;
      // const newToken = await refreshAccessToken(refreshToken);
      // useAppStore.getState().setToken(newToken);
      // originalRequest.headers.Authorization = `Bearer ${newToken}`;
      // return api(originalRequest);

      // For now, logout on 401
      useAppStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  requestOtp: (phone: string) => api.post('/auth/otp/request', {phone}),
  verifyOtp: (phone: string, otp: string) => 
    api.post('/auth/otp/verify', {phone, otp}),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
};

export const servicesApi = {
  getRecent: () => api.get('/services/recent'),
  getAll: () => api.get('/services/all'),
};

export const payApi = {
  sendMoney: (data: any) => api.post('/pay/send', data),
  buyAirtime: (data: any) => api.post('/pay/airtime', data),
  payBill: (data: any) => api.post('/pay/bill', data),
};

export const transactionsApi = {
  getTransactions: (page = 1, limit = 20) => 
    api.get(`/transactions?page=${page}&limit=${limit}`),
  getTransaction: (id: string) => api.get(`/transactions/${id}`),
};
