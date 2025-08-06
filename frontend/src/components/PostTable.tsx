import { Eye, MessageCircle, ThumbsUp, Clock, User, Edit, Trash2, MoreVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import type { Post } from "./PostCard";

interface PostTableProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  currentUser?: { name: string; role: string } | null;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
}

export function PostTable({ posts, onPostClick, currentUser, onEdit, onDelete }: PostTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return "어제";
    return date.toLocaleDateString("ko-KR");
  };

  const canEdit = (author: string) => currentUser?.name === author;
  const canDelete = (author: string) => currentUser?.name === author || currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">번호</TableHead>
            <TableHead className="w-[120px]">카테고리</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[100px]">작성자</TableHead>
            <TableHead className="w-[120px]">작성일</TableHead>
            <TableHead className="w-[80px] text-center">조회</TableHead>
            <TableHead className="w-[80px] text-center">좋아요</TableHead>
            <TableHead className="w-[80px] text-center">댓글</TableHead>
            <TableHead className="w-[100px] text-center">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow 
              key={post.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onPostClick(post)}
            >
              <TableCell className="text-muted-foreground">
                {posts.length - index}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  <h4 className="hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {post.content}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{post.views}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{post.likes}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.comments}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {(canEdit(post.author) || canDelete(post.author)) && (
                  <div className="flex items-center justify-center gap-1">
                    {canEdit(post.author) && onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                        className="h-7 px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                    {canDelete(post.author) && onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
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
      
      {posts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          표시할 게시물이 없습니다.
        </div>
      )}
    </div>
  );
}