import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, CheckCircle, Droplets, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Utensils } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TodoItem {
  id: number;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  category: 'feeding' | 'health' | 'grooming' | 'play' | 'other';
}

interface CatActivity {
  id: number;
  catName: string;
  activity: '물 마시기' | '사료 먹기';
  time: string;
}

interface CatActivityCam {
  id: number;
  catName: string;
  activity: string;
  timestamp: string;
  foodAmount?: string;
  thumbnail: string;
  duration: string;
}

const mockActivities: CatActivityCam[] = [
  {
    id: 1,
    catName: "나비",
    activity: "식사",
    timestamp: "2025-01-24T14:30:00Z",
    foodAmount: "25g",
    thumbnail: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=100&fit=crop",
    duration: "5분"
  },
  {
    id: 2,
    catName: "택시",
    activity: "낮잠",
    timestamp: "2025-01-24T13:45:00Z",
    thumbnail: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150&h=100&fit=crop",
    duration: "45분"
  },
  {
    id: 3,
    catName: "김치",
    activity: "놀이",
    timestamp: "2025-01-24T12:15:00Z",
    thumbnail: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=150&h=100&fit=crop",
    duration: "15분"
  },
  {
    id: 4,
    catName: "털볼이",
    activity: "식사",
    timestamp: "2025-01-24T11:30:00Z",
    foodAmount: "30g",
    thumbnail: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=150&h=100&fit=crop",
    duration: "7분"
  },
  {
    id: 5,
    catName: "나비",
    activity: "그루밍",
    timestamp: "2025-01-24T10:20:00Z",
    thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=100&fit=crop",
    duration: "12분"
  },
  {
    id: 6,
    catName: "택시",
    activity: "식사",
    timestamp: "2025-01-24T09:15:00Z",
    foodAmount: "22g",
    thumbnail: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=100&fit=crop",
    duration: "6분"
  }
];


// 고양이 활동 로그 생성

  export function DashboardNotices() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CatActivityCam | null>(null);
  const today = new Date();
  const todayString = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  
const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case '식사': return 'bg-orange-100 text-orange-800 border-orange-200';
      case '낮잠': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '놀이': return 'bg-green-100 text-green-800 border-green-200';
      case '그루밍': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return (
    <Card className="h-full">
      <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>실시간 스트리밍</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-500">LIVE</span>
                </div>
              </CardTitle>
            </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {/* Mock video background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <p className="text-lg">고양이 홈캠</p>
                    <p className="text-sm text-gray-300">실시간 스트리밍 중...</p>
                  </div>
                </div>

                {/* Video overlay with cats */}
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=450&fit=crop"
                  alt="Cat Live Stream"
                  className="w-full h-full object-cover opacity-70"
                />

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">14:35:22</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

        {/* Cat Activities */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">해상도</div>
                  <div className="font-medium">1080p</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">FPS</div>
                  <div className="font-medium">30</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">연결 상태</div>
                  <div className="font-medium text-green-600">안정</div>
                </div>
        </div>
        {/* Right - Activity Feed */}
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>오늘의 활동</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {mockActivities.length}개의 활동이 기록되었습니다
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {mockActivities.slice(0,3).map((activity) => (
                          <div
                            key={activity.id}
                            className="border border-border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedActivity(activity)}
                          >
                            <div className="flex gap-3">
                              {/* Thumbnail */}
                              <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={activity.thumbnail}
                                  alt={`${activity.catName} ${activity.activity}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
        
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium truncate">{activity.catName}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(activity.timestamp)}
                                  </span>
                                </div>
        
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className={`text-xs ${getActivityColor(activity.activity)}`}>
                                    {activity.activity}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.duration}</span>
                                  </div>
                                </div>
        
                                {activity.foodAmount && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Utensils className="w-3 h-3" />
                                    <span>식사량: {activity.foodAmount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
        
                      {/* Load More */}
                      <div className="text-center pt-2">
                        <Button variant="ghost" className="text-primary text-sm">
                          더 많은 활동 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
        {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedActivity.catName}의 {selectedActivity.activity}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                <ImageWithFallback
                  src={selectedActivity.thumbnail}
                  alt={`${selectedActivity.catName} ${selectedActivity.activity}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">시간:</span>
                  <span>{formatTime(selectedActivity.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">지속시간:</span>
                  <span>{selectedActivity.duration}</span>
                </div>
                {selectedActivity.foodAmount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">식사량:</span>
                    <span>{selectedActivity.foodAmount}</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setSelectedActivity(null)}
                className="w-full"
              >
                닫기
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      </CardContent>
    </Card>
  );
}