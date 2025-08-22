// components/QuestionDetail.tsx

import { User, MessageSquare, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Question } from "./QuestionForm";
import { Button } from "./ui/button"; // New import
import { Textarea } from "./ui/textarea"; // New import
import axios from 'axios'; // New import
import type { UserData } from "../types"; // New import
import { useState } from "react";

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: (id: number) => void;
  currentUser: UserData | null;
  onAnswerSubmitted: (updatedQuestion: Question) => void;
}

export function QuestionDetail({ question, onBack, canEdit, canDelete, onEdit, onDelete, currentUser, onAnswerSubmitted }: QuestionDetailProps) {
  const formatDate = (dateString: string) => {
    let dateToFormat;
    if (dateString.endsWith('Z')) {
      dateToFormat = new Date(dateString);
    } else {
      dateToFormat = new Date(dateString + 'Z');
    }

    return dateToFormat.toLocaleString("ko-KR", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const [answerContent, setAnswerContent] = useState(""); // New state

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    if (!currentUser || !currentUser.username) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      const payload = {
        questionId: question.id, // Add this line
        content: answerContent,
        author: currentUser.username,
      };
      const response = await axios.post(`/api/questions/${question.id}/answers`, payload, { withCredentials: true });

      if (response.status === 200) {
        const newAnswer = Array.isArray(response.data) ? response.data[0] : response.data;
        // Assuming the backend returns the updated question or just the new answer
        // For now, let's assume it returns the new answer and we need to update the question manually
        const updatedQuestion: Question = {
          ...question,
          answers: [...question.answers, newAnswer],
          status: '답변완료', // Update status
          answersCount: (question.answersCount ?? 0) + 1, // Increment answersCount
        };
        onAnswerSubmitted(updatedQuestion); // Notify parent
        setAnswerContent(""); // Clear form
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("답변 등록에 실패했습니다.");
    }
  };

  return (
    <div className="p-6"> {/* Changed p-2 to p-6 */}
      {/* 뒤로가기 및 수정/삭제 버튼 영역 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록
        </Button>

        {(canEdit || canDelete) && (
          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                className="hover:bg-primary/10"
              >
                <Edit className="w-4 h-4 mr-2" /> 수정
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(question.id)} // Pass question.id
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" /> 삭제
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 헤더: 제목, 상태, 작성자 정보 */}
      <div className="space-y-3 mb-6 pb-6 border-b">
        <Badge 
          variant={question.status === '답변완료' ? 'default' : 'secondary'}
          className="w-fit"
        >
          {question.status}
        </Badge>
        <h2 className="text-3xl font-bold leading-tight">{question.title}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{question.author}</span>
            </div>
            <span>{formatDate(question.createdAt)}</span>
        </div>
      </div>
      
      {/* 본문 내용: 줄바꿈을 인식하도록 처리 */}
      <div className="prose prose-lg max-w-none mb-8 min-h-[100px]">
        {question.content.split('\n').map((line, i) => (
          <p key={i} className="mb-4 last:mb-0">{line || '\u00A0'}</p> // 빈 줄도 공간을 차지하도록 처리
        ))}
      </div>

      {/* 답변 표시 */}
      {question?.answers?.length > 0 ? (
        <div className="flex-col items-start gap-4 border-t pt-6">
          <h4 className="font-semibold flex items-center gap-2 mb-4 text-xl">
            <MessageSquare className="w-6 h-6 text-primary" />
            답변 ({question?.answers?.length}개)
          </h4>
          <div className="w-full space-y-4">
            {question.answers.map((answer) => (
              <div key={answer.id} className="bg-gray-100 rounded-lg p-4 w-full">
                <p className="text-base text-foreground mb-3 leading-relaxed">{answer.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 font-medium"><User className="w-4 h-4" /><span>{answer.author}</span></div>
                  <span>{formatDate(answer.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-col items-start gap-4 border-t pt-6 text-muted-foreground">
          <h4 className="font-semibold flex items-center gap-2 mb-4 text-xl">
            <MessageSquare className="w-6 h-6 text-primary" />
            답변 (0개)
          </h4>
          <p>아직 답변이 없습니다.</p>
        </div>
      )}

      {/* 관리자 답변 폼 */}
      {currentUser?.role === "admin" && ( // Show if admin, regardless of status
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-semibold text-xl mb-4">답변 작성</h4>
          <Textarea
            placeholder="답변 내용을 입력하세요."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            rows={5}
            className="mb-4"
          />
          <Button onClick={handleSubmitAnswer}>답변 등록</Button>
        </div>
      )}
    </div>
  );
}