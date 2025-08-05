import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, CheckCircle, Droplets, UtensilsCrossed } from "lucide-react";

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

// 오늘의 일정 (Schedule 컴포넌트와 동기화)
const todaySchedule: TodoItem[] = [
  {
    id: 1,
    title: "나비 아침 식사",
    description: "건사료 30g + 습식사료",
    time: "08:00",
    completed: true,
    category: "feeding"
  },
  {
    id: 2,
    title: "털볼이 약 복용",
    description: "관절염 약 1정",
    time: "12:00",
    completed: false,
    category: "health"
  },
  {
    id: 3,
    title: "김치 놀이 시간",
    description: "낚싯대 장난감으로 15분간 놀아주기",
    time: "19:00",
    completed: false,
    category: "play"
  }
];

// 고양이 활동 로그 생성
const generateCatActivities = (): CatActivity[] => {
  const catNames = ["나비", "택시", "김치", "털볼이"];
  const activities: ('물 마시기' | '사료 먹기')[] = ['물 마시기', '사료 먹기'];
  const today = new Date();
  
  const logs: CatActivity[] = [];
  
  // 오늘 하루 동안의 활동 로그 생성 (시간 순으로 정렬)
  const times = [
    "07:30", "08:15", "09:45", "11:20", "12:35", 
    "14:10", "15:55", "17:25", "18:40", "20:15"
  ];
  
  times.forEach((time, index) => {
    const randomCat = catNames[Math.floor(Math.random() * catNames.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    logs.push({
      id: index + 1,
      catName: randomCat,
      activity: randomActivity,
      time: time
    });
  });
  
  return logs.sort((a, b) => b.time.localeCompare(a.time)); // 최신 순으로 정렬
};

export function DashboardNotices() {
  const today = new Date();
  const todayString = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  
  const completedTasks = todaySchedule.filter(task => task.completed).length;
  const totalTasks = todaySchedule.length;
  const catActivities = generateCatActivities();

  const getCategoryColor = (category: TodoItem['category']) => {
    switch (category) {
      case 'feeding': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'health': return 'bg-red-100 text-red-800 border-red-200';
      case 'grooming': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'play': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryText = (category: TodoItem['category']) => {
    switch (category) {
      case 'feeding': return '식사';
      case 'health': return '건강';
      case 'grooming': return '그루밍';
      case 'play': return '놀이';
      default: return '기타';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>{todayString}</CardTitle>
          <span className="text-sm text-primary">오늘의 일정</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Info */}
        <div className="text-sm text-muted-foreground">
          {completedTasks}/{totalTasks} 완료된 할일
        </div>

        {/* Today's Schedule */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">오늘의 일정</h3>
          {todaySchedule.map((task) => (
            <div 
              key={task.id}
              className={`flex items-start justify-between p-3 rounded-lg transition-colors ${
                task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(task.category)}`}
                  >
                    {getCategoryText(task.category)}
                  </Badge>
                  {task.time && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{task.time}</span>
                    </div>
                  )}
                </div>
                <h4 className={`text-sm mb-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {task.completed && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                )}
                {!task.completed && (
                  <Badge variant="secondary" className="text-xs">
                    대기
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cat Activities */}
        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="font-medium text-sm">고양이 활동 로그</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {catActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-2">
                  {activity.activity === '물 마시기' ? (
                    <Droplets className="w-4 h-4 text-blue-600" />
                  ) : (
                    <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm">
                    <span className="font-medium">{activity.catName}</span>
                    <span className="text-muted-foreground">가 {activity.activity}를 했습니다.</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        <div className="text-center pt-2">
          <Button variant="ghost" className="text-primary text-sm">
            일정 관리 페이지로 이동
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}