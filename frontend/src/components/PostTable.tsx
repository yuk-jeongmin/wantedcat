import { Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import type { Post } from "./PostCard";

interface PostTableProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  currentUser?: { username: string; role: string } | null;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
}

export function PostTable({ posts, onPostClick, currentUser, onEdit, onDelete }: PostTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
  };

  // 수정 권한: 현재 사용자가 작성자와 동일할 때
  const canEdit = (author: string) => currentUser?.username === author;
  // 삭제 권한: 현재 사용자가 작성자와 동일하거나 admin일 때
  const canDelete = (author:string) => currentUser?.username === author || currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"><span className="flex justify-center">번호</span></TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-24"><span className="flex justify-center">작성자</span></TableHead>
            <TableHead className="w-32"><span className="flex justify-center">등록일</span></TableHead>
            <TableHead className="w-20"><span className="flex justify-center">조회</span></TableHead>
            <TableHead className="w-20"><span className="flex justify-center">추천</span></TableHead>
            <TableHead className="w-20"><span className="flex justify-center">댓글</span></TableHead>
            <TableHead className="w-24"><span className="flex justify-center">작업</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow 
              key={post.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onPostClick(post)}
            >
              <TableCell className="text-center text-muted-foreground">
                {post.id} 
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span className="hover:text-primary transition-colors line-clamp-1">
                        {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                    </span>
                    {post.category && (
                    <span className="text-xs text-muted-foreground">
                      {post.category}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {post.author}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {post.views}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {post.likes}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {post.comments}
              </TableCell>

              {/* ----- 👇 수정/삭제 버튼이 렌더링되는 부분 ----- */}
              <TableCell className="text-center">
                {(canEdit(post.author) || canDelete(post.author)) && (
                  <div className="flex items-center justify-center gap-1">
                    {/* 수정 버튼 */}
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
                    {/* 삭제 버튼 */}
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
               {/* ----- 👆 여기까지 ----- */}

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