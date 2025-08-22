import axios from 'axios';

// Vite 환경변수 우선, 없으면 프록시(/api) 사용
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
});
