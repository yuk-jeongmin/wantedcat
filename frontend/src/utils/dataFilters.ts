import type { BoardType } from '../types';
import type { Post } from '../components/PostCard';
import type { Question } from '../components/QuestionCard';
import type { Notice } from '../components/NoticeCard';

export const filterAndSortData = (
  data: (Post | Question | Notice)[],
  currentBoard: BoardType,
  searchTerm: string,
  selectedCategory: string | null,
  selectedStatus: string | null,
  sortBy: string
): (Post | Question | Notice)[] => {
  const filterKey = currentBoard === 'qna' ? selectedStatus : selectedCategory;
  
  let filtered = data.filter((item: any) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterKey === null || 
      (currentBoard === 'qna' ? (item as Question).status === filterKey : item.category === filterKey);
    
    return matchesSearch && matchesFilter;
  });

  // Sort the data
  filtered = filtered.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'views':
        return b.views - a.views;
      case 'likes':
        if (currentBoard === 'info') {
          return (b as Post).likes - (a as Post).likes;
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
  data: (Post | Question | Notice)[],
  categories: string[]
): { [key: string]: number } => {
  if (currentBoard === 'qna') {
    const counts = { '접수': 0, '답변완료': 0 };
    (data as Question[]).forEach(question => {
      counts[question.status]++;
    });
    return counts;
  }
  
  return categories.reduce((acc, category) => {
    acc[category] = data.filter((item: any) => item.category === category).length;
    return acc;
  }, {} as { [key: string]: number });
};