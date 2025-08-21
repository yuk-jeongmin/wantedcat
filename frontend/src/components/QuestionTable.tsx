// components/QuestionTable.tsx

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Question } from "./QuestionForm";

interface QuestionTableProps {
  questions: Question[];
  onQuestionClick: (question: Question) => void;
  currentUser?: { username: string; role: string } | null;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
}

export function QuestionTable({ questions, onQuestionClick, currentUser, onEdit, onDelete }: QuestionTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const canEdit = (author: string) => currentUser?.username === author || currentUser?.role === 'admin';
  const canDelete = (author: string) => currentUser?.username === author || currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-28 text-center">작성자</TableHead>
            <TableHead className="w-32 text-center">등록일</TableHead>
            <TableHead className="w-20 text-center">답변</TableHead>
            <TableHead className="w-24 text-center">상태</TableHead>
            <TableHead className="w-24 text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow 
              key={question.id} 
              className="cursor-pointer hover:bg-gray-50/50"
              onClick={() => onQuestionClick(question)} // 행 클릭 시 상세 보기
            >
              <TableCell className="text-center text-muted-foreground">{question.id}</TableCell>
              <TableCell>
                <div className="font-medium hover:text-primary transition-colors line-clamp-1">
                  {question.title.length > 30 ? `${question.title.substring(0, 30)}...` :question.title}
                </div>
                {question.category && <div className="text-xs text-muted-foreground mt-1">{question.category}</div>}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">{question.author}</TableCell>
              <TableCell className="text-center text-muted-foreground">{formatDate(question.createdAt)}</TableCell>
              <TableCell className="text-center font-medium">
                <span className={question.answersCount && question.answersCount > 0 ? 'text-primary' : 'text-muted-foreground'}>
                  {question.answersCount ?? 0}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={question.status === '답변완료' ? 'default' : 'secondary'}
                  className={`capitalize ${question.status === '답변완료' ? 'bg-primary hover:bg-primary/90' : ''}`}
                >
                  {question.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {(canEdit(question.author) || canDelete(question.author)) && (
                  <div className="flex items-center justify-center gap-1">
                    {canEdit(question.author) && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(question); }} className="h-7 px-2">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {canDelete(question.author) && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(question.id); }} className="h-7 px-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {questions.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          등록된 질문이 없습니다.
        </div>
      )}
    </div>
  );
}