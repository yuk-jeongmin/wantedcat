import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  Utensils,
  Calendar,
  Target,
  AlertTriangle
} from "lucide-react";
import { Cat } from "./CatManagement";

interface StatisticsProps {
  cats: Cat[];
}

interface DailyData {
  date: string;
  food: number;
  water: number;
  recommended_food: number;
  recommended_water: number;
}

// Mock data for statistics
const generateMockData = (catId: number, period: 'week' | 'month') => {
  const days = period === 'week' ? 7 : 30;
  const data: DailyData[] = [];
  
  // Different cats have different eating patterns
  const baseFood = catId === 1 ? 45 : catId === 2 ? 35 : catId === 3 ? 30 : 55;
  const baseWater = catId === 1 ? 150 : catId === 2 ? 120 : catId === 3 ? 100 : 180;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some randomness to make it realistic
    const foodVariation = (Math.random() - 0.5) * 20;
    const waterVariation = (Math.random() - 0.5) * 40;
    
    data.push({
      date: period === 'week' 
        ? date.toLocaleDateString('ko-KR', { weekday: 'short' })
        : date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
      food: Math.max(0, baseFood + foodVariation),
      water: Math.max(0, baseWater + waterVariation),
      recommended_food: baseFood,
      recommended_water: baseWater
    });
  }
  
  return data;
};

export function Statistics({ cats }: StatisticsProps) {
  const [selectedCat, setSelectedCat] = useState<number>(cats[0]?.id || 1);
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');
  const [dataType, setDataType] = useState<'food' | 'water'>('food');

  const currentCat = cats.find(cat => cat.id === selectedCat) || cats[0];
  const chartData = generateMockData(selectedCat, timePeriod);
  
  // Calculate statistics
  const averageFood = chartData.reduce((sum, day) => sum + day.food, 0) / chartData.length;
  const averageWater = chartData.reduce((sum, day) => sum + day.water, 0) / chartData.length;
  const recommendedFood = chartData[0]?.recommended_food || 0;
  const recommendedWater = chartData[0]?.recommended_water || 0;
  
  const foodTrend = averageFood > recommendedFood ? 'up' : averageFood < recommendedFood * 0.8 ? 'down' : 'stable';
  const waterTrend = averageWater > recommendedWater ? 'up' : averageWater < recommendedWater * 0.8 ? 'down' : 'stable';

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <TrendingUp className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium mb-2">통계 조회</h1>
        <p className="text-muted-foreground">고양이별 섭식량과 음수량을 분석하고 건강 상태를 확인하세요.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">고양이:</label>
          <Select value={selectedCat.toString()} onValueChange={(value) => setSelectedCat(parseInt(value))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cats.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">기간:</label>
          <Select value={timePeriod} onValueChange={(value: 'week' | 'month') => setTimePeriod(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">주간</SelectItem>
              <SelectItem value="month">월간</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">데이터:</label>
          <Select value={dataType} onValueChange={(value: 'food' | 'water') => setDataType(value)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">섭식량</SelectItem>
              <SelectItem value="water">음수량</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {dataType === 'food' ? <Utensils className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                {currentCat?.name}의 {dataType === 'food' ? '섭식량' : '음수량'} 추이
                <Badge variant="outline">
                  {timePeriod === 'week' ? '주간' : '월간'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(1)}${dataType === 'food' ? 'g' : 'ml'}`,
                        name === 'food' ? '실제 섭식량' :
                        name === 'water' ? '실제 음수량' :
                        name === 'recommended_food' ? '권장 섭식량' : '권장 음수량'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey={dataType === 'food' ? 'recommended_food' : 'recommended_water'}
                      stackId="1"
                      stroke="#94a3b8"
                      fill="#f1f5f9"
                      strokeDasharray="5 5"
                    />
                    <Area
                      type="monotone"
                      dataKey={dataType}
                      stackId="2"
                      stroke="#34ADA9"
                      fill="#34ADA9"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Current Cat Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{currentCat?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">품종</span>
                <span className="text-sm">{currentCat?.breed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">체중</span>
                <span className="text-sm">{currentCat?.weight}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">나이</span>
                <span className="text-sm">{currentCat?.age}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">건강상태</span>
                <Badge 
                  variant={currentCat?.healthStatus === 'healthy' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {currentCat?.healthStatus === 'healthy' ? '건강' : 
                   currentCat?.healthStatus === 'caution' ? '주의' : '치료중'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {timePeriod === 'week' ? '주간' : '월간'} 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 섭식량</span>
                  <span>{(averageFood * chartData.length).toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 음수량</span>
                  <span>{(averageWater * chartData.length).toFixed(0)}ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">측정 일수</span>
                  <span>{chartData.length}일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 섭식량</span>
                  <span>{averageFood.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 음수량</span>
                  <span>{averageWater.toFixed(0)}ml</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}