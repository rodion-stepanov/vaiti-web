import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuthStore } from './stores/authStore';
import { routeTree } from './routeTree.gen';

const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} routeTree={routeTree} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

