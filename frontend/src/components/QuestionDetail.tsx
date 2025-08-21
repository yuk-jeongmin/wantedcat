// components/QuestionDetail.tsx

import { User, MessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Question } from "./QuestionForm";

interface QuestionDetailProps {
  question: Question;
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-2 z-49">
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
      {question.answers.length > 0 && (
        <div className="flex-col items-start gap-4 border-t pt-6">
          <h4 className="font-semibold flex items-center gap-2 mb-4 text-xl">
            <MessageSquare className="w-6 h-6 text-primary" />
            답변 ({question.answers.length}개)
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
      )}
    </div>
  );
}