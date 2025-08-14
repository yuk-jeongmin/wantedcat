// components/QuestionsDetail_ori.tsx
import { ArrowLeft, User, Clock, MessageSquare, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import type { Question } from "./QuestionForm"; // 또는 QuestionForm 의 타입 사용

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  // ⬇️ 추가: 답변 등록을 실제 API로 수행하고 싶을 때 상위에서 넘겨줌
  onSubmitAnswer?: (content: string) => Promise<void> | void;
  // ⬇️ 선택: 현재 사용자 표시/사용
  currentUser?: { username: string; role: string } | null;
}

export function QuestionDetail({
  question, onBack, canEdit = false, canDelete = false, onEdit, onDelete,
  onSubmitAnswer, currentUser
}: QuestionDetailProps) {
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [posting, setPosting] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("ko-KR", { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      setPosting(true);
      if (onSubmitAnswer) {
        await onSubmitAnswer(newAnswer.trim());
      } else {
        // fallback: 기존 동작
        console.log("New answer:", newAnswer.trim());
      }
      setNewAnswer("");
      setShowAnswerForm(false);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록
            </Button>
            <div className="flex items-center gap-3">
              <Badge 
                variant={question.status === '답변완료' ? 'default' : 'secondary'}
                className={question.status === '답변완료' ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {question.status}
              </Badge>
              {question.category && <Badge variant="outline">{question.category}</Badge>}
            </div>
          </div>

          {(canEdit || canDelete) && (
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="hover:bg-primary/10">
                  <Edit className="w-4 h-4 mr-2" /> 수정
                </Button>
              )}
              {canDelete && onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  <Trash2 className="w-4 h-4 mr-2" /> 삭제
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <h1 className="mb-4">{question.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><User className="w-4 h-4" /><span>{question.author}</span></div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{formatDate(question.createdAt)}</span></div>
              <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /><span>답변 {question.answers.length}개</span></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{question.content}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3>답변 ({question.answers.length}개)</h3>
            <Button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              variant={showAnswerForm ? "outline" : "default"}
              className={!showAnswerForm ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              {showAnswerForm ? "취소" : "답변 작성"}
            </Button>
          </CardHeader>
          <CardContent>
            {showAnswerForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                {/* 현재 사용자 보여주고 싶으면 */}
                {currentUser?.username && (
                  <div className="mb-2 text-sm text-muted-foreground">작성자: <b>{currentUser.username}</b></div>
                )}
                <div className="space-y-4">
                  <Textarea placeholder="답변을 작성해주세요..." value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)} rows={6}/>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAnswerForm(false)}>취소</Button>
                    <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim() || posting}
                            className="bg-primary hover:bg-primary/90">
                      {posting ? '등록 중...' : '답변 등록'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {question.answers.length > 0 ? (
              <div className="space-y-4">
                {question.answers.map((answer, index) => (
                  <div key={answer.id ?? index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="bg-primary text-primary-foreground">답변 {index + 1}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-3 h-3" /><span>{answer.author || '—'}</span>
                        <Clock className="w-3 h-3 ml-2" /><span>{answer.createdAt ? formatDate(answer.createdAt) : ''}</span>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-primary/30">
                      <p className="whitespace-pre-wrap leading-relaxed text-foreground">{answer.content || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>아직 답변이 없습니다.</p>
                <p className="text-sm">첫 번째 답변을 작성해보세요!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
