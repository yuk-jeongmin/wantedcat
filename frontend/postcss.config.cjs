// frontend/postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // Tailwind v4 PostCSS 플러그인
    require('autoprefixer'),
  ],
};
