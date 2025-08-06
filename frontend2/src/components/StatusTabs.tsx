import { Button } from "./ui/button";

interface StatusTabsProps {
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
  questionCounts: { [key: string]: number };
  onCreateClick: () => void;
  createButtonText: string;
}

export function StatusTabs({ 
  selectedStatus, 
  onStatusSelect, 
  questionCounts,
  onCreateClick,
  createButtonText
}: StatusTabsProps) {
  const totalQuestions = Object.values(questionCounts).reduce((sum, count) => sum + count, 0);
  const statuses = ['접수', '답변완료'];

  return (
    <div className="bg-white border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedStatus === null ? "default" : "ghost"}
            onClick={() => onStatusSelect(null)}
            className={`whitespace-nowrap ${
              selectedStatus === null 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            전체 ({totalQuestions})
          </Button>
          
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "ghost"}
              onClick={() => onStatusSelect(status)}
              className={`whitespace-nowrap ${
                selectedStatus === status 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status} ({questionCounts[status] || 0})
            </Button>
          ))}
        </div>
        
        <Button 
          onClick={onCreateClick}
          className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {createButtonText}
        </Button>
      </div>
    </div>
  );
}