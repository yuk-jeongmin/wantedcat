import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Question } from "./QuestionCard";

interface QuestionTableProps {
  questions: Question[];
  onQuestionClick: (question: Question) => void;
  currentUser?: { name: string; role: string } | null;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: number) => void;
}

export function QuestionTable({ questions, onQuestionClick, currentUser, onEdit, onDelete }: QuestionTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const canEdit = (author: string) => currentUser?.name === author || currentUser?.role === 'admin';
  const canDelete = (author: string) => currentUser?.name === author || currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-24">작성자</TableHead>
            <TableHead className="w-32">등록일</TableHead>
            <TableHead className="w-20">답변</TableHead>
            <TableHead className="w-24">상태</TableHead>
            <TableHead className="w-24">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow 
              key={question.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onQuestionClick(question)}
            >
              <TableCell>{question.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="hover:text-primary transition-colors line-clamp-1">
                    {question.title}
                  </span>
                  {question.category && (
                    <span className="text-xs text-muted-foreground">
                      {question.category}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {question.author}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(question.createdAt)}
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-sm ${question.answers.length > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {question.answers.length}
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={question.status === '답변완료' ? 'default' : 'secondary'}
                  className={question.status === '답변완료' ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {question.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {(canEdit(question.author) || canDelete(question.author)) && (
                  <div className="flex items-center justify-center gap-1">
                    {canEdit(question.author) && onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onEdit(question); }}
                        className="h-7 px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                    {canDelete(question.author) && onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onDelete(question.id); }}
                        className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}