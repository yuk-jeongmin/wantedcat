import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true, // Gitpod 환경에서 서버 접속을 위해 필요
    allowedHosts: ['5173-sjleecatthe-wantedcat-7dxfzhg0f8g.ws-us120.gitpod.io']
  },
});