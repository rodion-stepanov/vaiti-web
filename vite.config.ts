import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // host: '5.35.100.75',
    // port: 8080,
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/v1': {
        target: 'http://5.35.100.75:8080',
        changeOrigin: true,
      },
    },
  },
});
