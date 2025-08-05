import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchFooterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
}

export function SearchFooter({ searchTerm, onSearchChange, resultsCount }: SearchFooterProps) {
  return (
    <div className="bg-white border-t border-border sticky bottom-0 z-10">
      <div className="px-6 py-4">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="게시물 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              "{searchTerm}"에 대한 검색 결과 {resultsCount}개
            </p>
          )}
        </div>
      </div>
    </div>
  );
}