import { Button } from "./ui/button";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  postCounts: { [key: string]: number };
  onCreateClick?: () => void;
  createButtonText: string;
}

export function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  postCounts,
  onCreateClick,
  createButtonText
}: CategoryTabsProps) {
  const totalPosts = Object.values(postCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            onClick={() => onCategorySelect(null)}
            className={`whitespace-nowrap ${
              selectedCategory === null 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            전체 ({totalPosts})
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => onCategorySelect(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category} ({postCounts[category] || 0})
            </Button>
          ))}
        </div>
        
        {onCreateClick && (
          <Button 
            onClick={onCreateClick}
            className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}