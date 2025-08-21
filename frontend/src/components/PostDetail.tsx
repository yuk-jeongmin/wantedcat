// PostDetail.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, MessageCircle, Clock, User, Heart, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import axios from 'axios';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import type { Post } from "./PostCard";
import type { Question } from "./QuestionForm";

// ⬇️ 댓글 API 타입/함수 가져오기 (posts.ts에 export 되어 있어야 함)
import type { PostComment } from "../api/posts";
import { listPostComments, addPostComment } from "../api/posts";

interface PostDetailProps {
  item: Post | Question;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  loggedInUsername?: string; // <--- Add this line
}

export function PostDetail({ item, onBack, canEdit = false, canDelete = false, onEdit, onDelete, loggedInUsername }: PostDetailProps) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const isPost = "likes" in item;          // Post 구분
  const isQuestion = "status" in item;     // Question 구분

  useEffect(() => {
    // Post일 때만 댓글 목록 로드
    const load = async () => {
      if (!isPost) {
        setComments([]); // Question일 땐 이 컴포넌트에서 댓글 미사용
        return;
      }
      try {
        const data = await listPostComments(item.id); // GET /api/posts/{id}/comments
        setComments(data);
      } catch (e) {
        console.error("댓글 로드 실패:", e);
        setComments([]);
      }
    };
    load();
  }, [isPost, item]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("ko-KR") +
      " " +
      date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleLike = () => setLiked(!liked);

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    if (!loggedInUsername) {
        alert("로그인 후 댓글을 작성할 수 있습니다.");
        return;
    }
    try {
      const res = await axios.post(
        `/api/posts/${postId}/comments`,
        { content: newComment.trim(), author: loggedInUsername }, // <--- Add author here
        { withCredentials: true }
      );
      const created = res.data;
      setComments(prev => [...prev, created]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!loggedInUsername) {
        alert("로그인 후 댓글을 삭제할 수 있습니다.");
        return;
    }
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
        return;
    }
    try {
        await axios.delete(
            `/api/posts/${item.id}/comments/${commentId}`,
            {
                headers: { "X-USER-NAME": loggedInUsername },
                withCredentials: true,
            }
        );
        setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
        console.error("Failed to delete comment:", err);
        alert("댓글 삭제에 실패했습니다. 작성자만 삭제할 수 있습니다.");
    }
};

  // 헤더 우측 카운트: Post면 댓글 수, Question이면 답변 수
  const rightCount = isPost ? comments?.length : isQuestion ? (item as Question)?.answers?.length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-49 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록
            </Button>

            {(canEdit || canDelete) && (
              <div className="flex items-center gap-2">
                {canEdit && onEdit && (
                  <Button variant="outline" onClick={onEdit} className="hover:bg-primary/10">
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
              <div className="flex-1">
                {"category" in item && <Badge variant="secondary" className="mb-3">{item.category}</Badge>}
                {"status" in item && (
                  <Badge
                    variant={"outline"}
                    className={`mb-3 ${item.status === "답변완료" ? "border-green-600 text-green-600" : ""}`}
                  >
                    {item.status}
                  </Badge>
                )}
                <h1 className="text-2xl font-bold mb-3">{item.title}</h1>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {"views" in item && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{rightCount}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose max-w-none mb-6 min-h-[100px] whitespace-pre-wrap">{item.content}</div>

              {/* Post에서만 좋아요 버튼 표시 */}
              {isPost && (
                <>
                  <Separator className="my-6" />
                  <div className="flex items-center gap-4">
                    <Button
                      variant={liked ? "default" : "outline"}
                      onClick={handleLike}
                      className={liked ? "bg-primary hover:bg-primary/90" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                      좋아요 {(item as Post).likes + (liked ? 1 : 0)}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* ⬇️ 댓글 섹션: Post일 때만 렌더 */}
          {isPost && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">댓글 {comments.length}개</h3>
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
                      onClick={() => handleAddComment(item.id)}
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
                        <span className="text-muted-foreground">{formatDate(comment.createdAt)}</span>
                        {loggedInUsername && loggedInUsername === comment.author && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                삭제
                            </Button>
                        )}
                      </div>
                      <p className="pl-6 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
