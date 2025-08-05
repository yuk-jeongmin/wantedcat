import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  postCounts: { [key: string]: number };
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  postCounts 
}: CategoryFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h3 className="mb-3">카테고리</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(null)}
          className={selectedCategory === null ? "bg-primary hover:bg-primary/90" : ""}
        >
          전체
          <Badge variant="secondary" className="ml-2">
            {Object.values(postCounts).reduce((sum, count) => sum + count, 0)}
          </Badge>
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
            className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
          >
            {category}
            <Badge variant="secondary" className="ml-2">
              {postCounts[category] || 0}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}