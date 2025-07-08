import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  withCredentials: true,
});

// Attach access token on each request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  console.log('token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
