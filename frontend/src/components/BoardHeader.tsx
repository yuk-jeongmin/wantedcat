import { Search, Plus, Filter, Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface BoardHeaderProps {
  onNewPost: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function BoardHeader({ 
  onNewPost, 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange, 
  showFilters, 
  onToggleFilters 
}: BoardHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-primary mb-2">정보공유 게시판</h1>
            <p className="text-muted-foreground">유용한 정보를 공유하고 소통해보세요</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="게시물 검색..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'card' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange('card')}
                  className={`rounded-r-none ${viewMode === 'card' ? 'bg-primary hover:bg-primary/90' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange('table')}
                  className={`rounded-l-none ${viewMode === 'table' ? 'bg-primary hover:bg-primary/90' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="sm" 
                onClick={onToggleFilters}
                className={showFilters ? "bg-primary hover:bg-primary/90" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
              
              <Button onClick={onNewPost} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                새 글 작성
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}