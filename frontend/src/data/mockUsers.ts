import type { UserData } from '../types';

export const mockUsers: UserData[] = [
  {
    id: 1,
    username: "김집사",
    email: "catowner@gmail.com",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    joinDate: "2024-06-15T00:00:00Z",
    role: "user",
    streamKey: "asdfasdfasdfasdf"
  },
  {
    id: 2,
    username: "관리자",
    email: "admin@catcommunity.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    joinDate: "2024-01-01T00:00:00Z",
    role: "admin",
    streamKey: "asdfasdfasdfasdfasdf"
  }
];