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

function normalizePost(raw: any): Post {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    author: raw.author,
    createdAt: raw.createdAt ?? raw.created_at,
    category: raw.category ?? '',
    views: raw.views ?? 0,
    likes: raw.likes ?? 0,
    comments: raw.comments ?? raw.comments_count ?? 0,
  };
}

export async function listPosts(params?: { page?: number; size?: number; category?: string; q?: string; }) {
  const res = await api.get('/api/posts', { params });
  const data = res.data;
  if (Array.isArray(data)) {
    return { content: data.map(normalizePost), totalElements: data.length, totalPages: 1, number: 0, size: params?.size ?? 10 };
  }
  return {
    content: (data.content ?? []).map(normalizePost),
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
    number: data.number ?? 0,
    size: data.size ?? params?.size ?? 10,
  };
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

export interface PostComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export async function listPostComments(postId: number): Promise<PostComment[]> {
  const res = await api.get(`/api/posts/${postId}/comments`);
  return res.data;
}

export async function addPostComment(postId: number, payload: { author: string; content: string; }): Promise<PostComment> {
  const res = await api.post(`/api/posts/${postId}/comments`, payload);
  return res.data;
}

export async function deletePostComment(postId: number, commentId: number, author?: string): Promise<void> {
  await api.delete(`/api/posts/${postId}/comments/${commentId}`, { params: { author } });
}