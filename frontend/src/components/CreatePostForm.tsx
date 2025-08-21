import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import type { Post } from "./PostCard";

interface CreatePostFormProps {
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>) => void;
  editingPost?: Post | null;
}

export function CreatePostForm({ onClose, onSubmit, editingPost }: CreatePostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: ""
  });

  const categories = [
    "장난감 추천",
    "건강 관리",
    "계절 관리",
    "사료 정보",
    "그루밍",
    "행동 분석",
    "경험 공유",
    "기타"
  ];

  useEffect(() => {
    if (editingPost && editingPost.id) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        author: editingPost.author,
        category: editingPost.category
      });
    } else if (editingPost === null) {
      setFormData({
        title: "",
        content: "",
        author: "",
        category: ""
      });
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim() || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editingPost ? '글 수정' : '새 글 작성'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">작성자</Label>
                <Input
                  id="author"
                  placeholder="작성자명을 입력하세요"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  key={`select-${editingPost?.id || 'new'}`}
                  value={formData.category || undefined} 
                  onValueChange={(value) => {
                    if (value) {
                      setFormData(prev => ({ ...prev, category: value }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="게시물 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="게시물 내용을 입력하세요"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingPost ? '수정 완료' : '게시물 작성'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}