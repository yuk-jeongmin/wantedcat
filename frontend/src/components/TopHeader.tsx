import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TopHeader() {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-primary">캣밥바라기</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="사용자 프로필"
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              A
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <div className="text-sm text-foreground">Alvie0514</div>
            <div className="text-xs text-muted-foreground">s.ferguson@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}