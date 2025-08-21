import type { Notice } from "./NoticeCard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { ArrowLeft, Clock, User, Edit, Trash2 } from "lucide-react";

// NoticeDetail 컴포넌트에 필요한 props 타입 정의
interface NoticeDetailProps {
  notice: Notice;
  onBack: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoticeDetail({ notice, onBack, canEdit = false, canDelete = false, onEdit, onDelete }: NoticeDetailProps) {
  // 날짜 형식을 보기 좋게 변환하는 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    // [핵심] 1. 화면 전체를 덮는 반투명 오버레이
    // 클릭하면 onBack 함수가 호출되어 모달이 닫힙니다.
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-49 flex justify-center items-center p-4"
      onClick={onBack}
    >
      {/* [핵심] 2. 실제 콘텐츠가 담길 박스 */}
      {/* 이 부분을 클릭해도 모달이 닫히지 않도록 이벤트 전파를 막습니다. */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 뒤로가기 및 수정/삭제 버튼 영역 */}
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

          {/* 공지사항 상세 내용 카드 */}
          <Card>
            <CardHeader className="pb-4">
              <h1 className="text-2xl font-bold mb-3">{notice.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{notice.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-6" />
              <div className="prose max-w-none min-h-[150px] whitespace-pre-wrap">
                {notice.content}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}