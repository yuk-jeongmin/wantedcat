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

export const getCurrentCategories = (
  currentBoard: BoardType,
  data: (Post | Question | Notice)[]
): string[] => {
  if (currentBoard === 'qna') {
    return ['접수', '답변완료'];
  }
  return Array.from(new Set(data.map((item: any) => item.category)));
};