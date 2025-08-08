import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  AlarmClock,
  CheckCircle
} from "lucide-react";

interface TodoItem {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  category: 'feeding' | 'health' | 'grooming' | 'play' | 'other';
}

const mockTodos: TodoItem[] = [
  {
    id: 1,
    title: "나비 아침 식사",
    description: "건사료 30g + 습식사료",
    date: "2025-01-24",
    time: "08:00",
    completed: true,
    category: "feeding"
  },
  {
    id: 2,
    title: "털볼이 약 복용",
    description: "관절염 약 1정",
    date: "2025-01-24",
    time: "12:00",
    completed: false,
    category: "health"
  },
  {
    id: 3,
    title: "김치 놀이 시간",
    description: "낚싯대 장난감으로 15분간 놀아주기",
    date: "2025-01-24",
    time: "19:00",
    completed: false,
    category: "play"
  },
  {
    id: 4,
    title: "택시 브러싱",
    description: "털 정리 및 매트 제거",
    date: "2025-01-25",
    time: "10:00",
    completed: false,
    category: "grooming"
  }
];

export function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    time: '',
    category: 'other' as TodoItem['category']
  });

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getTodosForDate = (date: string) => {
    return todos.filter(todo => todo.date === date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim() || !selectedDate) return;

    const todoItem: TodoItem = {
      id: Math.max(...todos.map(t => t.id)) + 1,
      title: newTodo.title,
      description: newTodo.description,
      date: selectedDate,
      time: newTodo.time || undefined,
      completed: false,
      category: newTodo.category
    };

    setTodos(prev => [...prev, todoItem]);
    setNewTodo({ title: '', description: '', time: '', category: 'other' });
    setShowAddTodo(false);
  };

  const toggleTodoComplete = (todoId: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

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

  const days = getDaysInMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium mb-2">일정 관리</h1>
        <p className="text-muted-foreground">고양이들의 일정을 관리하고 할일을 추가하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {monthName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers */}
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="p-2"></div>;
                  }
                  
                  const dateString = formatDate(year, month, day);
                  const todosForDay = getTodosForDate(dateString);
                  const isToday = dateString === new Date().toISOString().split('T')[0];
                  const isSelected = selectedDate === dateString;
                  
                  return (
                    <div
                      key={`day-${day}`}
                      className={`p-2 border border-border rounded cursor-pointer hover:bg-gray-50 transition-colors min-h-[80px] ${
                        isToday ? 'bg-primary/10 border-primary' : ''
                      } ${isSelected ? 'bg-primary/20 border-primary' : ''}`}
                      onClick={() => setSelectedDate(dateString)}
                    >
                      <div className="text-sm font-medium mb-1">{day}</div>
                      <div className="space-y-1">
                        {todosForDay.slice(0, 2).map((todo) => (
                          <div
                            key={todo.id}
                            className={`text-xs p-1 rounded truncate ${
                              todo.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {todo.title}
                          </div>
                        ))}
                        {todosForDay.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{todosForDay.length - 2}개 더
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      })} 일정
                    </h3>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddTodo(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      할일 추가
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {getTodosForDate(selectedDate).map((todo) => (
                      <div
                        key={todo.id}
                        className={`flex items-center gap-3 p-3 border border-border rounded ${
                          todo.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => toggleTodoComplete(todo.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            todo.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {todo.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {todo.title}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getCategoryColor(todo.category)}`}>
                              {getCategoryText(todo.category)}
                            </Badge>
                          </div>
                          {todo.description && (
                            <p className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                              {todo.description}
                            </p>
                          )}
                          {todo.time && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{todo.time}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {getTodosForDate(selectedDate).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        이 날짜에 예정된 일정이 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlarmClock className="w-5 h-5" />
                오늘의 할일
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {getTodosForDate(new Date().toISOString().split('T')[0]).length}개의 할일
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTodosForDate(new Date().toISOString().split('T')[0]).map((todo) => (
                <div
                  key={todo.id}
                  className={`p-3 border border-border rounded ${
                    todo.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => toggleTodoComplete(todo.id)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {todo.completed && <CheckCircle className="w-3 h-3" />}
                    </button>
                    <span className={`font-medium text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.title}
                    </span>
                  </div>
                  
                  {todo.description && (
                    <p className={`text-xs mb-2 ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(todo.category)}`}>
                      {getCategoryText(todo.category)}
                    </Badge>
                    {todo.time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{todo.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {getTodosForDate(new Date().toISOString().split('T')[0]).length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  오늘 예정된 일정이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Todo Modal */}
      {showAddTodo && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>할일 추가</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="할일을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="상세 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">시간</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newTodo.time}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <select
                    id="category"
                    value={newTodo.category}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value as TodoItem['category'] }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="feeding">식사</option>
                    <option value="health">건강</option>
                    <option value="grooming">그루밍</option>
                    <option value="play">놀이</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddTodo(false);
                    setNewTodo({ title: '', description: '', time: '', category: 'other' });
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleAddTodo}
                  disabled={!newTodo.title.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}