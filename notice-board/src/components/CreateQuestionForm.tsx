import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Question } from "./QuestionCard";

interface CreateQuestionFormProps {
  onClose: () => void;
  onSubmit: (questionData: Omit<Question, 'id' | 'views' | 'status' | 'answers' | 'createdAt'>) => void;
  editingQuestion?: Question | null;
}

export function CreateQuestionForm({ onClose, onSubmit, editingQuestion }: CreateQuestionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: ""
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        title: editingQuestion.title,
        content: editingQuestion.content,
        author: editingQuestion.author,
        category: editingQuestion.category
      });
    }
  }, [editingQuestion]);

  const categories = [
    "건강 문의",
    "그루밍",
    "행동 교육",
    "사료 문의",
    "일반 질문"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2>{editingQuestion ? '질문 수정' : '질문 작성'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="질문 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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

            <div className="space-y-2">
              <Label htmlFor="author">작성자 *</Label>
              <Input
                id="author"
                placeholder="작성자명을 입력하세요"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">질문 내용 *</Label>
              <Textarea
                id="content"
                placeholder="질문 내용을 자세히 작성해주세요"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editingQuestion ? '수정 완료' : '질문 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}