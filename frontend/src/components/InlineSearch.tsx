import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface InlineSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
}

export function InlineSearch({ searchTerm, onSearchChange, resultsCount }: InlineSearchProps) {
  return (
    <div className="bg-gray-50 p-4 border-t border-border">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="게시물 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {resultsCount}개의 검색 결과
          </p>
        )}
      </div>
    </div>
  );
}