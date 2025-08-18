import { api } from '../lib/api'
import type { Question, Answer } from '../components/QuestionForm'

// 백엔드 타입 가정
type BackendStatus = '문의중' | '답변대기' | '답변완료'
interface BackendAnswer { id: number; content: string; author: string; createdAt: string }
interface BackendQuestion {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  category: string
  status: BackendStatus
  views: number
  answers?: BackendAnswer[]
  answersCount?: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size?: number
}

// 상태 매핑: '문의중' | '답변대기' -> '접수'
function mapStatus(s: BackendStatus): Question['status'] {
  return s === '답변완료' ? '답변완료' : '접수'
}

function mapAnswer(a: BackendAnswer): Answer {
  return { id: a.id, content: a.content, author: a.author, createdAt: a.createdAt }
}

function mapQuestion(q: BackendQuestion): Question {
  const answers = q.answers
    ? q.answers.map(mapAnswer)
    : Array.from({ length: q.answersCount ?? 0 }, (_, i) => ({
        id: i + 1, content: '', author: '', createdAt: ''
      }))
  return {
    id: q.id,
    title: q.title,
    content: q.content,
    author: q.author,
    createdAt: q.createdAt,
    category: q.category,
    status: mapStatus(q.status),
    views: q.views,
    answers,
  }
}

// 목록
export async function listQuestions(params?: {
  page?: number; size?: number; category?: string; status?: '접수' | '답변완료'; q?: string;
}): Promise<PageResponse<Question>> {
  const { page = 0, size = 20, category, status, q } = params ?? {}
  // 프론트 '접수'는 백엔드 '문의중/답변대기'로 취급 → 서버 필터는 생략하고 프론트에서 필터링하거나,
  // 서버가 status=접수 를 모르면 아예 보내지 않는 게 안전.
  const res = await api.get('/api/questions', { params: { page, size, category, q } })
  const data = res.data as PageResponse<BackendQuestion>
  return { ...data, content: data.content.map(mapQuestion) }
}

// 단건
export async function getQuestion(id: number): Promise<Question> {
  const res = await api.get(`/api/questions/${id}`)
  return mapQuestion(res.data as BackendQuestion)
}

// 생성
export async function createQuestion(payload: {
  title: string; content: string; author: string; category: string;
}): Promise<Question> {
  const res = await api.post('/api/questions', payload)
  return mapQuestion(res.data as BackendQuestion)
}

// 수정(작성자 검증: author 필수)
export async function updateQuestion(
  id: number,
  payload: { author: string; title?: string; content?: string; category?: string; status?: BackendStatus }
): Promise<Question> {
  const res = await api.put(`/api/questions/${id}`, payload)
  return mapQuestion(res.data as BackendQuestion)
}

// 삭제(쿼리로 author)
export async function deleteQuestion(id: number, author: string): Promise<void> {
  await api.delete(`/api/questions/${id}`, { params: { author } })
}

// 답변 등록
export async function addAnswer(
  questionId: number,
  payload: { author: string; content: string }
): Promise<Answer> {
  const res = await api.post(`/api/questions/${questionId}/answers`, payload)
  const a = res.data as BackendAnswer
  return mapAnswer(a)
}
