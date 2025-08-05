import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Droplets, Coffee, Target, TrendingUp } from "lucide-react";
import type { Cat } from "./CatManagement";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CatFeedingStatsProps {
  cats: Cat[];
  onGoToCatManagement: () => void;
}

export function CatFeedingStats({ cats, onGoToCatManagement }: CatFeedingStatsProps) {
  const [selectedCats, setSelectedCats] = useState<number[]>([]);

  const toggleCatSelection = (catId: number) => {
    setSelectedCats(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const selectedCatData = cats.filter(cat => selectedCats.includes(cat.id));

  // 차트 데이터 준비
  const chartData = selectedCatData.map(cat => ({
    name: cat.name,
    음수량: cat.dailyWaterIntake || 0,
    목표음수량: cat.targetWaterIntake || 0,
    식사량: cat.dailyFoodIntake || 0,
    목표식사량: cat.targetFoodIntake || 0,
  }));

  // 전체 평균 계산
  const avgWaterIntake = cats.length > 0 
    ? Math.round(cats.reduce((sum, cat) => sum + (cat.dailyWaterIntake || 0), 0) / cats.length)
    : 0;
  
  const avgFoodIntake = cats.length > 0 
    ? Math.round(cats.reduce((sum, cat) => sum + (cat.dailyFoodIntake || 0), 0) / cats.length)
    : 0;

  const getWaterPercentage = (cat: Cat) => {
    if (!cat.targetWaterIntake || !cat.dailyWaterIntake) return 0;
    return Math.min((cat.dailyWaterIntake / cat.targetWaterIntake) * 100, 100);
  };

  const getFoodPercentage = (cat: Cat) => {
    if (!cat.targetFoodIntake || !cat.dailyFoodIntake) return 0;
    return Math.min((cat.dailyFoodIntake / cat.targetFoodIntake) * 100, 100);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              음수량 & 식사량 모니터링
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              고양이별 일일 음수량과 식사량을 확인하세요
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onGoToCatManagement}>
            관리하기
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">평균 음수량</span>
            </div>
            <div className="text-xl font-semibold text-blue-900">{avgWaterIntake}ml</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">평균 식사량</span>
            </div>
            <div className="text-xl font-semibold text-orange-900">{avgFoodIntake}g</div>
          </div>
        </div>

        {/* 고양이 선택 버튼들 */}
        <div>
          <h3 className="text-sm font-medium mb-3">모니터링할 고양이 선택</h3>
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCats.includes(cat.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCatSelection(cat.id)}
                className={`flex items-center gap-2 ${
                  selectedCats.includes(cat.id) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                  <ImageWithFallback
                    src={cat.image || `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=32&h=32&fit=crop&crop=face`}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 선택된 고양이들의 그래프 */}
        {selectedCats.length > 0 ? (
          <div className="space-y-6">
            {/* 가로바 차트 */}
            <div>
              <h3 className="text-sm font-medium mb-3">비교 차트</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar 
                      dataKey="음수량" 
                      fill="#3b82f6" 
                      name="음수량 (ml)"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      dataKey="식사량" 
                      fill="#f97316" 
                      name="식사량 (g)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 개별 고양이 상세 정보 */}
            <div>
              <h3 className="text-sm font-medium mb-3">개별 상세 정보</h3>
              <div className="space-y-4">
                {selectedCatData.map((cat) => (
                  <div key={cat.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <ImageWithFallback
                          src={cat.image || `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=32&h=32&fit=crop&crop=face`}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{cat.name}</h4>
                        <p className="text-xs text-muted-foreground">{cat.breed}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* 음수량 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-muted-foreground">음수량</span>
                          </div>
                          <span className="text-xs">
                            {cat.dailyWaterIntake}ml / {cat.targetWaterIntake}ml
                          </span>
                        </div>
                        <Progress 
                          value={getWaterPercentage(cat)} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {getWaterPercentage(cat).toFixed(0)}% 달성
                        </div>
                      </div>

                      {/* 식사량 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Coffee className="w-3 h-3 text-orange-600" />
                            <span className="text-xs text-muted-foreground">식사량</span>
                          </div>
                          <span className="text-xs">
                            {cat.dailyFoodIntake}g / {cat.targetFoodIntake}g
                          </span>
                        </div>
                        <Progress 
                          value={getFoodPercentage(cat)} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {getFoodPercentage(cat).toFixed(0)}% 달성
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">모니터링할 고양이를 선택해주세요</p>
            <p className="text-xs text-muted-foreground">
              위의 버튼을 클릭하여 고양이별 음수량과 식사량을 확인할 수 있습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}