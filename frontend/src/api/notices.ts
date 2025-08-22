// src/api/notices.ts
import { api } from '../lib/api';
import type { Notice } from '../components/NoticeCard';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // 현재 페이지 index
  size?: number;
}

// 목록(검색 q/카테고리 category 선택)
export async function listNotices(params?: {
  page?: number; size?: number; category?: string; q?: string;
}): Promise<PageResponse<Notice>> {
  const { page = 0, size = 20, category, q } = params ?? {};
  const res = await api.get('/api/notices', { params: { page, size, category, q } });
  return res.data;
}

// 단건 조회
export async function getNotice(id: number): Promise<Notice> {
  const res = await api.get(`/api/notices/${id}`);
  return res.data;
}

// 생성 (author 문자열 기반)
export async function createNotice(payload: {
  title: string;
  content: string;
  author: string; // 문자열
  category: string;
  priority?: '일반'|'중요'|'긴급';
  pinned?: boolean;
}): Promise<Notice> {
  const paramPayload = {
    author : payload.author,
    title : payload.title,
    content : payload.content,
    category : payload.category,
    priority : payload.priority,
    isPinned: payload.pinned
  }

  const res = await api.post('/api/notices', paramPayload);
  return res.data;
}

// 수정 (author 필요: 소유자 검증)
export async function updateNotice(
  id: number,
  payload: {
    author: string; // 필수
    title?: string;
    content?: string;
    category?: string;
    priority?: '일반'|'중요'|'긴급';
    pinned?: boolean;
  }
): Promise<Notice> {
  const paramPayload = {
    author : payload.author,
    title : payload.title,
    content : payload.content,
    category : payload.category,
    priority : payload.priority,
    isPinned: payload.pinned
  }

  const res = await api.put(`/api/notices/${id}`, paramPayload);
  return res.data;
}

// 삭제 (쿼리스트링 author 필요)
export async function deleteNotice(id: number, author: string): Promise<void> {
  await api.delete(`/api/notices/${id}`, { params: { author } });
}
