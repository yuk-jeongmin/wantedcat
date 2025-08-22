import type { BoardType } from '../types';
import type { Post } from '../components/PostCard';
import type { Question } from '../components/QuestionCard';
import type { Notice } from '../components/NoticeCard';

export const getBoardTitle = (currentBoard: BoardType): string => {
  switch (currentBoard) {
    case 'info': return '정보게시판';
    case 'qna': return 'Q&A';
    case 'notice': return '공지사항';
    default: return '게시판';
  }
};

export const getCreateButtonText = (currentBoard: BoardType): string => {
  switch (currentBoard) {
    case 'info': return '새 글 작성';
    case 'qna': return '질문하기';
    case 'notice': return '공지 작성';
    default: return '작성하기';
  }
};

export const getCurrentData = (
  currentBoard: BoardType,
  posts: Post[],
  questions: Question[],
  notices: Notice[]
): (Post | Question | Notice)[] => {
  switch (currentBoard) {
    case 'info': return posts;
    case 'qna': return questions;
    case 'notice': return notices;
    default: return [];
  }
};

// --- 여기부터: 배열/페이지 응답 모두 지원 ---
type PageLike<T> = { content: T[] } & Record<string, unknown>;

function toArray<T = any>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && Array.isArray((data as PageLike<T>).content)) {
    return (data as PageLike<T>).content;
  }
  return [];
}

export const getCurrentCategories = (
  currentBoard: BoardType,
  data: unknown   // ← 배열도, {content: []}도 OK
): string[] => {
  if (currentBoard === 'qna') {
    // 상태 탭 고정이라면 그대로 반환
    return ['접수', '답변완료'];
  }

  const list = toArray<Post | Question | Notice>(data);

  return Array.from(
    new Set(
      list
        .map((item: any) => (item?.category ?? '').toString().trim())
        .filter((v) => v.length > 0)
    )
  );
};