import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/authStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    await useAuthStore.getState().checkAuth();

    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
