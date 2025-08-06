import { Pin, Edit, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Notice } from "./NoticeCard";

interface NoticeTableProps {
  notices: Notice[];
  onNoticeClick: (notice: Notice) => void;
  currentUser?: { name: string; role: string } | null;
  onEdit?: (notice: Notice) => void;
  onDelete?: (noticeId: number) => void;
}

export function NoticeTable({ notices, onNoticeClick, currentUser, onEdit, onDelete }: NoticeTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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

  const canEdit = (author: string) => currentUser?.name === author || currentUser?.role === 'admin';
  const canDelete = (author: string) => currentUser?.name === author || currentUser?.role === 'admin';

  // Sort notices: pinned first, then by priority, then by date
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { '긴급': 3, '중요': 2, '일반': 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-24">작성자</TableHead>
            <TableHead className="w-32">등록일</TableHead>
            <TableHead className="w-16">조회</TableHead>
            <TableHead className="w-20">우선순위</TableHead>
            <TableHead className="w-24">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNotices.map((notice) => (
            <TableRow 
              key={notice.id} 
              className={`cursor-pointer hover:bg-gray-50 ${
                notice.isPinned ? 'bg-yellow-50/50' : ''
              }`}
              onClick={() => onNoticeClick(notice)}
            >
              <TableCell>{notice.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {notice.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                  <div className="flex flex-col">
                    <span className="hover:text-primary transition-colors line-clamp-1">
                      {notice.title}
                    </span>
                    {notice.category && (
                      <span className="text-xs text-muted-foreground">
                        {notice.category}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {notice.author}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(notice.createdAt)}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {notice.views}
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(notice.priority)}>
                  {notice.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {(canEdit(notice.author) || canDelete(notice.author)) && (
                  <div className="flex items-center justify-center gap-1">
                    {canEdit(notice.author) && onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onEdit(notice); }}
                        className="h-7 px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                    {canDelete(notice.author) && onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onDelete(notice.id); }}
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