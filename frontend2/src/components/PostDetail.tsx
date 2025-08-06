import { useState } from "react";
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Clock, User, Heart, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import type { Post } from "./PostCard";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostDetail({ post, onBack, canEdit = false, canDelete = false, onEdit, onDelete }: PostDetailProps) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "김개발",
      content: "정말 유용한 정보네요! 감사합니다.",
      createdAt: "2025-01-20T10:30:00Z"
    },
    {
      id: 2,
      author: "이디자인",
      content: "저도 비슷한 경험이 있는데, 추가로 이런 방법도 있어요...",
      createdAt: "2025-01-20T11:15:00Z"
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR") + " " + date.toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' });
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: comments.length + 1,
      author: "익명",
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
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
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            )}
            {canDelete && onDelete && (
              <Button 
                variant="outline" 
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

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3">
                {post.category}
              </Badge>
              <h1 className="mb-3">{post.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center gap-4">
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLike}
              className={liked ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
              좋아요 {post.likes + (liked ? 1 : 0)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h3>댓글 {comments.length}개</h3>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                댓글 작성
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="pl-6 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}