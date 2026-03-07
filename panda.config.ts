import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  theme: {
    extend: {
      keyframes: {
        successIndicator: {
          '0%': { opacity: 1 },
          '50%': { opacity: 1 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
});
