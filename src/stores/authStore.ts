import { create } from 'zustand';
import { api } from '@/lib/api';
import { router } from '@/router';
import { isApiError } from '@/lib/typeguards';

interface User {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  gender: string;
  role: string;
}

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthCheckComplete: boolean;
  hhCode: string | null;
  hhState: string | null;
  setTokens: (accessToken: string) => void;
  setHhData: (code: string | null, state: string | null) => void;
  telegramLogin: (user: TelegramUserData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  isAuthCheckComplete: false,
  hhCode: null,
  hhState: null,
  setTokens: (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken });
  },
  setHhData: (code, state) => set({ hhCode: code, hhState: state }),
  telegramLogin: async (user: TelegramUserData) => {
    try {
      const { data } = await api.post('/v1/telegram/auth', user);
      get().setTokens(data.accessToken);
      router.navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Telegram login failed', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/v1/users/logout');
    } catch (error) {
      console.error('Logout failed', error);
    }
    localStorage.removeItem('accessToken');
    set({ accessToken: null, user: null, isAuthCheckComplete: true });
    router.navigate({ to: '/' });
  },
  checkAuth: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isAuthCheckComplete: true, user: null });
      return;
    }

    // If user is already loaded, no need to check again
    if (get().user) {
      set({ isAuthCheckComplete: true });
      return;
    }

    set({ isAuthCheckComplete: false });
    try {
      const { data } = await api.get<User>('/v1/users/me');
      set({ user: data, isAuthCheckComplete: true });
    } catch (error) {
      console.error('Auth check failed:', error);
      // If the server responded with an error (any non-2xx status), log the user out.
      if (isApiError(error)) {
        get().logout();
      } else {
        // For other errors (network, etc.), just mark the check as complete
        // to allow for retries without logging the user out.
        set({ isAuthCheckComplete: true });
      }
    }
  },
}));
