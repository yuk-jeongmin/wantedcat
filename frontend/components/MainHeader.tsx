import { Grid, List, SortDesc } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MainHeaderProps {
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  postsCount: number;
  selectedCategory: string | null;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function MainHeader({ 
  viewMode, 
  onViewModeChange, 
  postsCount, 
  selectedCategory,
  sortBy,
  onSortChange
}: MainHeaderProps) {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2>{selectedCategory || "전체 게시물"}</h2>
          <p className="text-sm text-muted-foreground">{postsCount}개의 게시물</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="likes">추천순</SelectItem>
              <SelectItem value="views">조회순</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>
    </div>
  );
}