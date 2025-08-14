// src/pages/QuestionsBoard.tsx
import { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { InlineSearch } from './InlineSearch'
import { QuestionTable } from './QuestionTable'
import { CreateQuestionForm } from './CreateQuestionForm'
import { QuestionDetail as QuestionsDetail } from './QuestionDetail_ori' // ← 답변 입력 있는 버전
import type { Question } from './QuestionForm'
import { listQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, addAnswer } from '../api/questions'

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id) }, [value, delay])
  return debounced
}

export default function QuestionsBoard() {
  // 로그인 붙기 전 임시 사용자
  const [currentUser] = useState<{ username: string; role: string } | null>({
    username: '김집사', role: 'user'
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [resultsCount, setResultsCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const dq = useDebounce(searchTerm, 300)

  const [openForm, setOpenForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const [openDetail, setOpenDetail] = useState(false)
  const [selected, setSelected] = useState<Question | null>(null)

  const fetchList = async () => {
    setLoading(true)
    try {
      const page = await listQuestions({ page: 0, size: 20, q: dq || undefined })
      setQuestions(page.content)
      setResultsCount(page.totalElements)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchList() }, [dq])

  const handleRowClick = async (q: Question) => {
    try {
      const fresh = await getQuestion(q.id)
      setSelected(fresh)
      setOpenDetail(true)
    } catch {
      alert('질문을 불러오지 못했습니다.')
    }
  }

  const handleOpenCreate = () => { setEditingQuestion(null); setOpenForm(true) }
  const handleEdit = (q: Question) => { setEditingQuestion(q); setOpenForm(true) }

  const handleDelete = async (questionId: number) => {
    const target = questions.find(q => q.id === questionId)
    if (!target) return
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteQuestion(questionId, target.author) // 백엔드: author 필요
      await fetchList()
      if (openDetail && selected?.id === questionId) { setOpenDetail(false); setSelected(null) }
    } catch {
      alert('삭제 실패(작성자 일치 필요)')
    }
  }

  const handleSubmit = async (payload: Omit<Question,'id'|'views'|'status'|'answers'|'createdAt'>) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, { author: payload.author, ...payload })
      } else {
        await createQuestion(payload)
      }
      await fetchList()
    } catch {
      alert('저장 실패')
    }
  }

  // 상세에서 답변 등록
  const handleAddAnswer = async (content: string) => {
    if (!selected) return
    try {
      await addAnswer(selected.id, { author: currentUser?.username ?? '익명', content })
      const fresh = await getQuestion(selected.id) // 새 답변 반영
      setSelected(fresh)
      await fetchList() // 목록의 답변 수 갱신
    } catch {
      alert('답변 등록 실패')
    }
  }

  const canEditSelected = useMemo(
    () => !!(selected && (currentUser?.username === selected.author || currentUser?.role === 'admin')),
    [selected, currentUser]
  )
  const canDeleteSelected = canEditSelected

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Q&A</h2>
        <Button onClick={handleOpenCreate}>질문 작성</Button>
      </div>

      <InlineSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} resultsCount={resultsCount} />

      <QuestionTable
        questions={questions}
        onQuestionClick={handleRowClick}
        currentUser={currentUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {openForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden p-6">
            <h3 className="text-lg font-semibold mb-2">{editingQuestion ? '질문 수정' : '질문 작성'}</h3>
            <CreateQuestionForm
              editingQuestion={editingQuestion}
              onSubmit={handleSubmit}
              onClose={() => setOpenForm(false)}
            />
          </div>
        </div>
      )}

      {openDetail && selected && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute inset-0 overflow-auto">
            <QuestionsDetail
              question={selected}
              onBack={() => { setOpenDetail(false); setSelected(null) }}
              canEdit={canEditSelected}
              canDelete={canDeleteSelected}
              onEdit={() => { setOpenDetail(false); handleEdit(selected) }}
              onDelete={() => { handleDelete(selected.id) }}
              onSubmitAnswer={handleAddAnswer}           // ← 답변 등록 연결
              currentUser={currentUser}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// // components/QuestionBoard.tsx

// import { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
// import { QuestionForm } from './QuestionForm';
// import { QuestionTable } from './QuestionTable';
// import { QuestionDetail } from './QuestionDetail';
// import type { Question } from './QuestionForm';

// // 1. QuestionBoard가 부모(App.tsx)로부터 받을 props 타입 정의
// interface QuestionBoardProps {
//   questions: Question[];
//   currentUser: { username: string; role: string } | null;
// }

// export function QuestionBoard({ questions: initialQuestions, currentUser }: QuestionBoardProps) {
//   // 2. 부모로부터 받은 데이터를 내부 상태로 관리
//   const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  
//   // 3. 팝업 제어를 위한 상태들
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

//   // 부모로부터 받은 데이터가 변경될 때마다 목록 업데이트
//   useEffect(() => {
//     setQuestions(initialQuestions);
//   }, [initialQuestions]);
  
//   // "글쓰기" 버튼 클릭 시 -> 폼 팝업 열기
//   const handleWriteClick = () => {
//     setEditingQuestion(null);
//     setIsFormVisible(true);
//   };

//   // "수정" 버튼 클릭 시 -> 수정용 폼 팝업 열기
//   const handleEditClick = (question: Question) => {
//     setEditingQuestion(question);
//     setIsFormVisible(true);
//   };
  
//   // 테이블의 행 클릭 시 -> 상세 보기 팝업 열기
//   const handleQuestionClick = (question: Question) => {
//     setSelectedQuestion(question);
//   };

//   // 폼 제출 시 (글 생성 또는 수정)
//   const handleFormSubmit = (data: Omit<Question, 'id' | 'author' | 'createdAt' | 'status' | 'views' | 'answers'>) => {
//     if (editingQuestion) {
//       setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...editingQuestion, ...data } : q));
//     } else {
//       if (!currentUser) return alert("로그인이 필요합니다.");
//       const newQuestion: Question = { ...data, id: Date.now(), author: currentUser.username, createdAt: new Date().toISOString(), status: '접수', views: 0, answers: [] };
//       setQuestions(prev => [newQuestion, ...prev]);
//     }
//     setIsFormVisible(false);
//     setEditingQuestion(null);
//   };

//   // 질문 삭제 시
//   const handleDeleteQuestion = (questionId: number) => {
//     if (window.confirm('정말 이 질문을 삭제하시겠습니까?')) {
//       setQuestions(prev => prev.filter(q => q.id !== questionId));
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Q&A</h1>
//         {currentUser && <Button onClick={handleWriteClick}>질문하기</Button>}
//       </div>

//       {/* 항상 표시되는 질문 테이블 */}
//       <QuestionTable 
//         questions={questions}
//         onQuestionClick={handleQuestionClick}
//         currentUser={currentUser}
//         onEdit={handleEditClick}
//         onDelete={handleDeleteQuestion}
//       />

//       {/* 상세 보기 팝업 */}
//       <Dialog open={!!selectedQuestion} onOpenChange={(isOpen) => !isOpen && setSelectedQuestion(null)}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           {selectedQuestion && <QuestionDetail question={selectedQuestion} />}
//         </DialogContent>
//       </Dialog>
      
//       {/* 글 작성/수정 팝업 */}
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