// import { useEffect, useMemo, useState } from 'react';
// import { Button } from './ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
// import { QuestionForm } from './QuestionForm';
// import { QuestionTable } from './QuestionTable';
// import { QuestionDetail } from './QuestionDetail';
// import { InlineSearch } from './InlineSearch';
// import type { Question } from './QuestionForm';
// import {
//   listQuestions,
//   getQuestion,
//   createQuestion,
//   updateQuestion,
//   deleteQuestion,
//   // addAnswer, // (원하면 QuestionsDetail_ori로 바꾸고 활성화)
// } from '../api/questions';

// // 디바운스 훅 (과요청 방지)
// function useDebounce<T>(value: T, delay = 300) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// // 부모(App.tsx)로부터 받던 props — 없어도 동작하도록 전부 optional
// interface QuestionBoardProps {
//   questions?: Question[];
//   currentUser?: { username: string; role: string } | null;
// }

// export function QuestionBoard({
//   questions: initialQuestions,
//   currentUser: parentUser,
// }: QuestionBoardProps) {
//   // 현재 사용자: 부모가 주면 사용, 아니면 임시 유저
//   const [currentUser] = useState<{ username: string; role: string } | null>(
//     parentUser ?? { username: '김집사', role: 'user' }
//   );

//   // 목록 상태
//   const [questions, setQuestions] = useState<Question[]>(initialQuestions ?? []);
//   const [resultsCount, setResultsCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // 검색
//   const [searchTerm, setSearchTerm] = useState('');
//   const dq = useDebounce(searchTerm, 300);

//   // 폼/상세 모달 상태
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

//   // 부모가 questions를 계속 내려주면 동기화 (외부 데이터와도 호환)
//   useEffect(() => {
//     if (initialQuestions) setQuestions(initialQuestions);
//   }, [initialQuestions]);

//   // 목록 조회(API)
//   const fetchList = async () => {
//     setLoading(true);
//     try {
//       const page = await listQuestions({ page: 0, size: 20, q: dq || undefined });
//       setQuestions(page.content);
//       setResultsCount(page.totalElements);
//     } catch (e) {
//       console.error(e);
//       // 실패해도 화면은 유지
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 최초/검색어 변경 시 재조회
//   useEffect(() => {
//     fetchList();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dq]);

//   // 행 클릭 → 상세(최신 데이터로 갱신)
//   const handleQuestionClick = async (q: Question) => {
//     try {
//       const fresh = await getQuestion(q.id);
//       setSelectedQuestion(fresh);
//     } catch (e) {
//       console.error(e);
//       alert('질문을 불러오지 못했습니다.');
//     }
//   };

//   // 글쓰기
//   const handleWriteClick = () => {
//     setEditingQuestion(null);
//     setIsFormVisible(true);
//   };

//   // 수정
//   const handleEditClick = (q: Question) => {
//     setEditingQuestion(q);
//     setIsFormVisible(true);
//   };

//   // 폼 제출 (생성/수정)
//   const handleFormSubmit = async (
//     data: Omit<Question, 'id' | 'author' | 'createdAt' | 'status' | 'views' | 'answers'>
//   ) => {
//     try {
//       if (!currentUser) return alert('로그인이 필요합니다.');
//       if (editingQuestion) {
//         // 백엔드가 author 문자열로 소유자 검증 → 기존 작성자 전달
//         await updateQuestion(editingQuestion.id, { author: editingQuestion.author, ...data });
//       } else {
//         await createQuestion({ ...data, author: currentUser.username });
//       }
//       await fetchList();
//       setIsFormVisible(false);
//       setEditingQuestion(null);
//     } catch (e) {
//       console.error(e);
//       alert('저장 실패');
//     }
//   };

//   // 삭제
//   const handleDeleteQuestion = async (questionId: number) => {
//     const target = questions.find((q) => q.id === questionId);
//     if (!target) return;
//     if (!window.confirm('정말 이 질문을 삭제하시겠습니까?')) return;

//     try {
//       await deleteQuestion(questionId, target.author); // 백엔드: author 필요
//       await fetchList();
//       if (selectedQuestion?.id === questionId) setSelectedQuestion(null);
//     } catch (e) {
//       console.error(e);
//       alert('삭제 실패(작성자 일치 필요)');
//     }
//   };

//   // 상세에서 수정/삭제 권한
//   const canEditSelected = useMemo(
//     () =>
//       !!(
//         selectedQuestion &&
//         (currentUser?.username === selectedQuestion.author || currentUser?.role === 'admin')
//       ),
//     [selectedQuestion, currentUser]
//   );
//   const canDeleteSelected = canEditSelected;

//   return (
//     <div className="container mx-auto p-4 md:p-6 space-y-4">
//       {/* 헤더 */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Q&A</h1>
//         {currentUser && <Button onClick={handleWriteClick}>질문하기</Button>}
//       </div>

//       {/* 검색 바 */}
//       <InlineSearch
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         resultsCount={resultsCount}
//       />

//       {/* 목록 */}
//       <QuestionTable
//         questions={questions}
//         onQuestionClick={handleQuestionClick}
//         currentUser={currentUser}
//         onEdit={handleEditClick}
//         onDelete={handleDeleteQuestion}
//       />

//       {/* 상세 보기 (Dialog) */}
//       <Dialog open={!!selectedQuestion} onOpenChange={(isOpen) => !isOpen && setSelectedQuestion(null)}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           {selectedQuestion && (
//             <QuestionDetail
//               question={selectedQuestion}
//               // QuestionDetail_ori(답변작성 포함)로 바꾸고 싶으면 아래처럼 props 추가 가능
//               // onBack={() => setSelectedQuestion(null)}
//               // canEdit={canEditSelected}
//               // canDelete={canDeleteSelected}
//               // onEdit={() => { setSelectedQuestion(null); handleEditClick(selectedQuestion) }}
//               // onDelete={() => handleDeleteQuestion(selectedQuestion.id)}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* 글 작성/수정 (Dialog) */}
//       <Dialog open={isFormVisible} onOpenChange={(isOpen) => !isOpen && setIsFormVisible(false)}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>{editingQuestion ? '질문 수정' : '새 질문 작성'}</DialogTitle>
//           </DialogHeader>
//           <QuestionForm
//             onSubmit={handleFormSubmit}
//             onCancel={() => setIsFormVisible(false)}
//             editingQuestion={editingQuestion}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // App.tsx에서 두 방식 모두 임포트 가능하게
// export default QuestionBoard;

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