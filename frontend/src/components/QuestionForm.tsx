// components/QuestionForm.tsx (최종 수정본)

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export interface Answer {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
  status: '접수' | '답변완료';
  views: number;
  answers: Answer[];
}

// 폼 데이터 타입을 정의합니다.
type QuestionFormData = Omit<Question, 'id' | 'author' | 'createdAt' | 'status' | 'views' | 'answers'>;

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
  editingQuestion?: Question | null;
}

export function QuestionForm({ onSubmit, onCancel, editingQuestion }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({ title: '', content: '', category: '' });

  // 수정 모드일 경우, 폼 데이터를 채워줍니다.
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        title: editingQuestion.title,
        content: editingQuestion.content,
        category: editingQuestion.category,
      });
    } else {
      // 새 글 작성 모드일 경우 폼을 비웁니다.
      setFormData({ title: '', content: '', category: '' });
    }
  }, [editingQuestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Card를 제거하고 form을 최상위 요소로 사용합니다.
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label htmlFor="category" className="font-medium">카테고리</label>
        <Input 
          id="category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          placeholder="예: 기술, 계정, 기타" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">제목</label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          placeholder="제목을 입력하세요" 
          required 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="content" className="font-medium">내용</label>
        <Textarea 
          id="content" 
          name="content" 
          value={formData.content} 
          onChange={handleChange} 
          placeholder="궁금한 점을 자세하게 적어주세요" 
          rows={8} 
          required 
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {editingQuestion ? '수정 완료' : '질문 등록'}
        </Button>
      </div>
    </form>
  );
}