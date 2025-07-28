import { createFileRoute, redirect } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import { useAuthStore } from '../stores/authStore';
import { isApiError } from '@/lib/typeguards';

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

const AuthComponent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { telegramLogin } = useAuthStore();

  useEffect(() => {
    const handleTelegramAuth = async (user: TelegramUserData) => {
      setIsLoading(true);
      setError(null);
      try {
        await telegramLogin(user);
      } catch (e) {
        const errorMessage = isApiError(e)
          ? e.response.data?.message
          : 'Ошибка авторизации';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onTelegramAuth = handleTelegramAuth;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'Denis_Super_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    const authContainer = document.getElementById('telegram-auth-container');
    authContainer?.appendChild(script);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onTelegramAuth = null;
      if (authContainer && script.parentNode === authContainer) {
        authContainer.removeChild(script);
      }
    };
  }, [telegramLogin]);

  return (
    <div className="bg-background flex grow flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <img
          src={logo}
          alt="Вайти Лого"
          className="mx-auto h-32 w-32 rounded-4xl"
        />
        <h1 className="mt-4 text-3xl font-bold">Добро пожаловать</h1>
        <p className="text-muted-foreground">
          Войдите через Telegram, чтобы продолжить
        </p>
      </div>
      <div
        id="telegram-auth-container"
        className="flex w-full max-w-md flex-col items-center"
      >
        {isLoading && <p>Загрузка...</p>}
        {error && (
          <p className="text-destructive text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    await useAuthStore.getState().checkAuth();
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: AuthComponent,
});
