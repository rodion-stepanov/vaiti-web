import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown } from 'lucide-react';

const RootComponent = () => {
  const { user, isAuthCheckComplete, logout } = useAuthStore();

  return (
    <div className="bg-background relative flex min-h-screen flex-col bg-fixed">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <h2 className="text-primary text-2xl font-bold">Вайти</h2>
        <div className="flex items-center gap-4">
          {isAuthCheckComplete ? (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span>{user.firstName || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard">
                    <DropdownMenuItem>Дашборд</DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard/settings">
                    <DropdownMenuItem>Настройки</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Выйти</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
            )
          ) : (
            <Skeleton className="h-8 w-32" />
          )}
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
