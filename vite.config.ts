import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'QR Camera',
        display: 'standalone',
        background_color: '#080808',
        theme_color: '#080808',
      },
    }),
  ],
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
