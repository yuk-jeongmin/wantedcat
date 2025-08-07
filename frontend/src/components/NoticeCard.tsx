import { Pin, Clock, User, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
  views: number;
  priority: '일반' | '중요' | '긴급';
  isPinned: boolean;
}

interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoticeCard({ notice, onClick, canEdit = false, canDelete = false, onEdit, onDelete }: NoticeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return "어제";
    return date.toLocaleDateString("ko-KR");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '긴급':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case '중요':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
        notice.isPinned 
          ? 'border-l-yellow-400 bg-yellow-50/50' 
          : notice.priority === '긴급'
            ? 'border-l-red-500'
            : notice.priority === '중요'
              ? 'border-l-orange-500'
              : 'border-l-primary/20'
      } hover:border-l-primary`} 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            {notice.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
            <Badge className={getPriorityColor(notice.priority)}>
              {notice.priority}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {notice.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(notice.createdAt)}
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
          {notice.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {notice.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{notice.author}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{notice.views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}