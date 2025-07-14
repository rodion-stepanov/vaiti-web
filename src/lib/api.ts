import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

let baseURL = '/';
if (import.meta.env.PROD) {
  const url = new URL('https://5.35.100.75');
  url.port = '443';
  baseURL = url.toString();
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach access token on each request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
