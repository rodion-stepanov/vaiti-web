import { createFileRoute, redirect } from '@tanstack/react-router';
import React, { useState } from 'react';
import logo from '@/assets/logo.png';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isApiError } from '@/lib/typeguards';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleAuth: (isLogin: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = React.memo(
  ({
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    handleAuth,
    isLoading,
    error,
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Вход' : 'Регистрация'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleAuth(isLogin)}
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </CardFooter>
      {error && (
        <p className="text-destructive pb-4 text-center text-sm">{error}</p>
      )}
    </Card>
  ),
);

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (isLogin: boolean) => {
    setError(null);
    setIsLoading(true);
    try {
      const { login, register } = useAuthStore.getState();
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data?.message
        : 'Ошибка авторизации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formProps = {
    email,
    setEmail,
    password,
    setPassword,
    handleAuth,
    isLoading,
    error,
  };

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
          Войдите или зарегистрируйтесь, чтобы продолжить
        </p>
      </div>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="bg-gradient-brand poi grid w-full grid-cols-2">
          <TabsTrigger className="cursor-pointer" value="login">
            Вход
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="register">
            Регистрация
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <AuthForm isLogin={true} {...formProps} />
        </TabsContent>
        <TabsContent value="register">
          <AuthForm isLogin={false} {...formProps} />
        </TabsContent>
      </Tabs>
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
