// src/utils/dataFilters.ts
import type { BoardType } from '../types';
import type { Post } from '../components/PostCard';
import type { Question } from '../components/QuestionCard';
import type { Notice } from '../components/NoticeCard';

// --- 배열 또는 { content: T[] } 모두를 배열로 바꿔주는 헬퍼 ---
type PageLike<T> = { content: T[] } & Record<string, unknown>;
const toArray = <T = any>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as PageLike<T>).content)) {
    return (data as PageLike<T>).content;
  }
  return [];
};

// 상태 문자열 정규화(백엔드가 '문의중'이면 프론트 '접수'로 통일)
const normalizeStatus = (s?: string) => (s === '문의중' ? '접수' : s ?? '');

export const filterAndSortData = (
  data: unknown,
  currentBoard: BoardType,
  searchTerm: string,
  selectedCategory: string | null,
  selectedStatus: string | null,
  sortBy: string
): (Post | Question | Notice)[] => {
  const list = toArray<Post | Question | Notice>(data);
  const filterKey = currentBoard === 'qna' ? selectedStatus : selectedCategory;

  const q = (searchTerm ?? '').toLowerCase().trim();

  let filtered = list.filter((item: any) => {
    const title = (item?.title ?? '').toString().toLowerCase();
    const content = (item?.content ?? '').toString().toLowerCase();
    const author = (item?.author ?? '').toString().toLowerCase();
    const category = (item?.category ?? '').toString().toLowerCase();

    const matchesSearch =
      q.length === 0 ||
      title.includes(q) ||
      content.includes(q) ||
      author.includes(q) ||
      category.includes(q);

    const matchesFilter =
      filterKey == null ||
      (currentBoard === 'qna'
        ? normalizeStatus((item as Question)?.status) === filterKey
        : item?.category === filterKey);

    return matchesSearch && matchesFilter;
  });

  filtered = filtered.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'latest': {
        const at = new Date(a?.createdAt ?? 0).getTime() || 0;
        const bt = new Date(b?.createdAt ?? 0).getTime() || 0;
        return bt - at;
      }
      case 'views':
        return (b?.views ?? 0) - (a?.views ?? 0);
      case 'likes':
        if (currentBoard === 'info') {
          return (b as Post)?.likes - (a as Post)?.likes;
        }
        return 0;
      default:
        return 0;
    }
  });

  return filtered;
};

export const getCounts = (
  currentBoard: BoardType,
  data: unknown,
  categories: string[]
): { [key: string]: number } => {
  const list = toArray<Post | Question | Notice>(data);

  if (currentBoard === 'qna') {
    const counts: Record<string, number> = { '접수': 0, '답변완료': 0 };
    (list as Question[]).forEach((q) => {
      const key = normalizeStatus(q.status);
      if (counts[key] != null) counts[key] += 1;
    });
    return counts;
  }

  return categories.reduce((acc, category) => {
    acc[category] = list.filter((item: any) => item?.category === category).length;
    return acc;
  }, {} as Record<string, number>);
};
