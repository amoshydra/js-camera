import { defineConfig } from '@pandacss/dev';
import { removeUnusedCssVars } from './builds/panda/remove-unused-css-vars';
import { removeUnusedKeyframes } from './builds/panda/remove-unused-keyframes';

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
          '100%': { opacity: 0 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  hooks: {
    // https://panda-css.com/docs/concepts/hooks#remove-unused-variables-from-final-css
    'cssgen:done': ({ artifact, content }) => {
      if (artifact === 'styles.css') {
        return removeUnusedCssVars(removeUnusedKeyframes(content));
      }
    },
  },
});
