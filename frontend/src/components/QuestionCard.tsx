import { Clock, User, MessageSquare, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

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

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function QuestionCard({ question, onClick, canEdit = false, canDelete = false, onEdit, onDelete }: QuestionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return "어제";
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge 
            variant={question.status === '답변완료' ? 'default' : 'secondary'}
            className={question.status === '답변완료' ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {question.status}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(question.createdAt)}
            </span>
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28 z-50">
                  {canEdit && onEdit && (
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onEdit(); 
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                  )}
                  {canDelete && onDelete && (
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onDelete(); 
                      }}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <h3 className="line-clamp-2 hover:text-primary transition-colors">
          {question.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {question.content}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{question.author}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{question.answers.length}</span>
            </div>
          </div>
        </div>

        {/* 답변 표시 */}
        {question.answers.length > 0 && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="text-xs text-muted-foreground mb-2">답변</div>
            <div className="space-y-2">
              {question.answers.map((answer) => (
                <div key={answer.id} className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-foreground mb-2 leading-relaxed">
                    {answer.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{answer.author}</span>
                    </div>
                    <span>{formatDate(answer.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}