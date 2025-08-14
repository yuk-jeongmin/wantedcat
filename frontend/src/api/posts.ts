// src/api/posts.ts
import { api } from '../lib/api';
import type { Post } from '../components/PostCard';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // 현재 페이지 index
  size?: number;
}

export async function listPosts(params?: {
  page?: number; size?: number; category?: string; q?: string;
}): Promise<PageResponse<Post>> {
  const { page = 0, size = 10, category, q } = params ?? {};
  const res = await api.get('/api/posts', { params: { page, size, category, q } });
  return res.data;
}

export async function getPost(id: number): Promise<Post> {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
}

export async function createPost(payload: {
  title: string; content: string; author: string; category: string;
}): Promise<Post> {
  const res = await api.post('/api/posts', payload);
  return res.data;
}

// 수정 시 author(작성자)로 소유자 검증
export async function updatePost(
  id: number,
  payload: { author: string; title?: string; content?: string; category?: string; }
): Promise<Post> {
  const res = await api.put(`/api/posts/${id}`, payload);
  return res.data;
}

// 삭제도 author를 쿼리로 넘김
export async function deletePost(id: number, author: string): Promise<void> {
  await api.delete(`/api/posts/${id}`, { params: { author } });
}
