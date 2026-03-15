import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.BUILD_PUBLIC_PATH ?? '/';
const gitSha = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()
  .substring(0, 9);

export default defineConfig({
  define: {
    'import.meta.env.VITE_GIT_SHA': JSON.stringify(gitSha),
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'QR Camera',
        description: 'A QR code scanner in the browser',
        id: 'https://amoshydra.github.io' + base,
        start_url: 'https://amoshydra.github.io' + base,
        display: 'fullscreen',
        categories: ['utilities'],
        background_color: '#080808',
        theme_color: '#080808',
        icons: [
          {
            src: base + 'img/icons/square-128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: base + 'img/icons/square-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [],
        share_target: {
          action: base + '?share',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            files: [
              {
                name: 'file',
                accept: ['image/*'],
              },
            ],
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~styled-system': resolve(__dirname, 'styled-system'),
    },
  },
  base,
  server: {
    host: true,
    allowedHosts: true,
  },
});
