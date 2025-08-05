import type { UserData } from '../types';

export const mockUsers: UserData[] = [
  {
    id: 1,
    name: "김집사",
    email: "catowner@gmail.com",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    joinDate: "2024-06-15T00:00:00Z",
    role: "user"
  },
  {
    id: 2,
    name: "관리자",
    email: "admin@catcommunity.com",
    phone: "010-0000-0000",
    address: "서울시 중구 관리자로 1",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    joinDate: "2024-01-01T00:00:00Z",
    role: "admin"
  }
];