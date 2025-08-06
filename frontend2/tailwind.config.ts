// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,json,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;