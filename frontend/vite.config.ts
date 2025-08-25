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
    allowedHosts: ['*'],
    proxy: {
            
      '/api': { target: 'http://backspringboot:8080',
        changeOrigin: true },
      '/collection': {
        target: 'http://collectionservice:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/collection/, ''), // '/collection' 제거
      },
      // 추가-jks: FastAPI(aiservice, 8001)
      '/ai': {
        target: 'http://aiservice:8001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai/, ''), // '/ai' 제거
      },
      '/app': {
          target: 'http://backspringboot:8080',
          changeOrigin: true,
          secure: false,
        },
        
       '/public': {
          target: 'http://backspringboot:8080',
          changeOrigin: true,
          secure: false,
        },
         
      '/hls': {
        target: 'http://streamingservice:8555',   // MediaMTX HLS 원본(같은 호스트에서 8555)
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