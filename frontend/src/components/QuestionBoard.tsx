// components/QuestionBoard.tsx

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { QuestionForm } from './QuestionForm';
import { QuestionTable } from './QuestionTable';
import { QuestionDetail } from './QuestionDetail';
import type { Question } from './QuestionForm';

// 1. QuestionBoard가 부모(App.tsx)로부터 받을 props 타입 정의
interface QuestionBoardProps {
  questions: Question[];
  currentUser: { username: string; role: string } | null;
}

export function QuestionBoard({ questions: initialQuestions, currentUser }: QuestionBoardProps) {
  // 2. 부모로부터 받은 데이터를 내부 상태로 관리
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  
  // 3. 팝업 제어를 위한 상태들
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // 부모로부터 받은 데이터가 변경될 때마다 목록 업데이트
  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);
  
  // "글쓰기" 버튼 클릭 시 -> 폼 팝업 열기
  const handleWriteClick = () => {
    setEditingQuestion(null);
    setIsFormVisible(true);
  };

  // "수정" 버튼 클릭 시 -> 수정용 폼 팝업 열기
  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setIsFormVisible(true);
  };
  
  // 테이블의 행 클릭 시 -> 상세 보기 팝업 열기
  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  // 폼 제출 시 (글 생성 또는 수정)
  const handleFormSubmit = (data: Omit<Question, 'id' | 'author' | 'createdAt' | 'status' | 'views' | 'answers'>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...editingQuestion, ...data } : q));
    } else {
      if (!currentUser) return alert("로그인이 필요합니다.");
      const newQuestion: Question = { ...data, id: Date.now(), author: currentUser.username, createdAt: new Date().toISOString(), status: '접수', views: 0, answers: [] };
      setQuestions(prev => [newQuestion, ...prev]);
    }
    setIsFormVisible(false);
    setEditingQuestion(null);
  };

  // 질문 삭제 시
  const handleDeleteQuestion = (questionId: number) => {
    if (window.confirm('정말 이 질문을 삭제하시겠습니까?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Q&A</h1>
        {currentUser && <Button onClick={handleWriteClick}>질문하기</Button>}
      </div>

      {/* 항상 표시되는 질문 테이블 */}
      <QuestionTable 
        questions={questions}
        onQuestionClick={handleQuestionClick}
        currentUser={currentUser}
        onEdit={handleEditClick}
        onDelete={handleDeleteQuestion}
      />

      {/* 상세 보기 팝업 */}
      <Dialog open={!!selectedQuestion} onOpenChange={(isOpen) => !isOpen && setSelectedQuestion(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedQuestion && <QuestionDetail question={selectedQuestion} />}
        </DialogContent>
      </Dialog>
      
      {/* 글 작성/수정 팝업 */}
      <Dialog open={isFormVisible} onOpenChange={(isOpen) => !isOpen && setIsFormVisible(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? '질문 수정' : '새 질문 작성'}</DialogTitle>
          </DialogHeader>
          <QuestionForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormVisible(false)}
            editingQuestion={editingQuestion}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}