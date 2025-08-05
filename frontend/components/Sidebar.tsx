import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  onNewPost: () => void;
}

export function Sidebar({ onNewPost }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-primary mb-2">정보공유</h1>
        <p className="text-sm text-muted-foreground">개발자 커뮤니티</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-md bg-primary text-primary-foreground">
            게시판
          </button>
        </nav>
      </div>

      {/* New Post Button */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={onNewPost} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          새 글 작성
        </Button>
      </div>
    </div>
  );
}