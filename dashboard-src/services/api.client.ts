import axios, { AxiosError, AxiosInstance } from 'axios';
import toast from 'react-hot-toast';
import { env } from '@dashboard/config/env';

// A burst of rate-limited requests would otherwise stack one toast per request.
let rateLimitNoticeAt = 0;

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/admin-login#/login';
      }
      if (error.response?.status === 429 && Date.now() - rateLimitNoticeAt > 10_000) {
        rateLimitNoticeAt = Date.now();
        toast.error('Too many requests. Please wait a moment and try again.');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
