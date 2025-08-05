import { ArrowLeft, User, Clock, Eye, Pin, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import type { Notice } from "./NoticeCard";

interface NoticeDetailProps {
  notice: Notice;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoticeDetail({ notice, onBack, canEdit = false, canDelete = false, onEdit, onDelete }: NoticeDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록
            </Button>
            <div className="flex items-center gap-3">
              {notice.isPinned && <Pin className="w-5 h-5 text-yellow-600" />}
              <Badge className={getPriorityColor(notice.priority)}>
                {notice.priority}
              </Badge>
              {notice.category && (
                <Badge variant="outline">
                  {notice.category}
                </Badge>
              )}
            </div>
          </div>

          {(canEdit || canDelete) && (
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onEdit}
                  className="hover:bg-primary/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
              )}
              {canDelete && onDelete && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Notice */}
        <Card className={notice.isPinned ? 'bg-yellow-50/50' : ''}>
          <CardHeader>
            <h1 className="mb-4">{notice.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{notice.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(notice.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>조회 {notice.views}회</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {notice.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}