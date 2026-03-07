import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~styled-system': resolve(__dirname, 'styled-system'),
    },
  },
  base: process.env.BUILD_PUBLIC_PATH,
  server: {
    host: true,
    allowedHosts: true,
  },
});
