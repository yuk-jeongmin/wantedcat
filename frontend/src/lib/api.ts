import axios from 'axios';

const base =
  (import.meta as any)?.env?.VITE_API_BASE_URL // Vite
  ?? '';

export const api = axios.create({
  baseURL: base || '', // 프록시 사용 시 ''로 두고 '/api' 상대경로 호출
  withCredentials: false,
});

// 필요시 요청/응답 인터셉터 추가 가능
// api.interceptors.request.use((config) => { ...; return config });
