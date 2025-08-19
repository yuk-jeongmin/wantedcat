import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    host: true, // Gitpod 환경에서 서버 접속을 위해 필요
    allowedHosts: ['5174-ksyeoni-wantedcat-u6pqstrr9l4.ws-us121.gitpod.io'],
    proxy: {
            '/api': { target: 'https://8080-ksyeoni-wantedcat-u6pqstrr9l4.ws-us121.gitpod.io', changeOrigin: true }
      ,
      '/hls': {
        target: 'https://8555-ksyeoni-wantedcat-u6pqstrr9l4.ws-us121.gitpod.io',   // MediaMTX HLS 원본(같은 호스트에서 8555)
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/hls/, ''), // /hls → /
      },
    },
  
  },
  css:{
    postcss:{
      plugins: [tailwindcss()],
    }
  }
});