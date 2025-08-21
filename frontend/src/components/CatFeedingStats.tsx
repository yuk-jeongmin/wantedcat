import { useEffect, useMemo, useState } from "react";
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
  selectedCats: number[];
  onCatSelectionChange: (ids: number[]) => void;
  // App.tsx에서 currentUser.email을 이 prop으로 전달합니다.
  userId?: string; 
}

// 백엔드 응답 타입
type DailyCatStats = {
  catName: string;
  totalWaterIntake: number;
  totalFoodIntake: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const base = API_BASE_URL || ""; // 빈 문자열이면 상대경로 사용

export function CatFeedingStats({
  cats,
  onGoToCatManagement,
  selectedCats,
  onCatSelectionChange,
  userId: userEmailProp, // prop 이름을 userEmailProp으로 받아 명확하게 함
}: CatFeedingStatsProps) {
  const [stats, setStats] = useState<Record<string, DailyCatStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 오늘 날짜(로컬) → YYYY-MM-DD
  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString("en-CA"); // e.g., 2025-08-21
  }, []);

  // [수정] 사용자 식별자를 email로 명확하게 사용
  const userEmail = useMemo(() => {
    // 부모 컴포넌트에서 받은 email을 최우선으로 사용
    return userEmailProp || localStorage.getItem("email") || "";
  }, [userEmailProp]);

  // 이벤트 통계 불러오기
  useEffect(() => {
    // [수정] API_BASE_URL 대신 base, userId 대신 userEmail을 확인
    if (!userEmail) {
      return;
    }
    const controller = new AbortController();

    async function fetchDailyStats() {
      setLoading(true);
      setError(null);
      try {
        // [수정] API 요청 시 userId 파라미터에 userEmail 값을 전달
        const url = `/api/events/stats?userId=${encodeURIComponent(userEmail)}&date=${todayStr}`;
        
        // [수정] 불필요한 fetch 호출 제거 및 mode: 'cors' 주석 처리 유지
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include', // 세션 쿠키를 주고받기 위해 필수
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: DailyCatStats[] = await res.json();

        const byName: Record<string, DailyCatStats> = {};
        for (const row of data) {
          if (row && row.catName) byName[row.catName] = row;
        }
        setStats(byName);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e?.message || "이벤트 통계 조회 실패");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDailyStats();
    return () => controller.abort();
  }, [base, userEmail, todayStr]); // [수정] 의존성 배열 업데이트

  // 선택 토글
  const toggleCatSelection = (catId: number) => {
    const newSelection = selectedCats.includes(catId)
      ? selectedCats.filter((id) => id !== catId)
      : [...selectedCats, catId];
    onCatSelectionChange(newSelection);
  };

  const selectedCatData = cats.filter((cat) => selectedCats.includes(cat.id));

  // UI에 사용할 "오늘" 일일량(이벤트 통계 기반)
  const getTodayWater = (cat: Cat) => stats[cat.name]?.totalWaterIntake ?? 0;
  const getTodayFood = (cat: Cat) => stats[cat.name]?.totalFoodIntake ?? 0;

  const chartData = selectedCatData.map((cat) => ({
    name: cat.name,
    음수량: getTodayWater(cat),
    식사량: getTodayFood(cat),
  }));

  const avgWaterIntake = useMemo(() => {
    if (cats.length === 0) return 0;
    const sum = cats.reduce((acc, cat) => acc + (getTodayWater(cat) || 0), 0);
    return Math.round(sum / cats.length);
  }, [cats, stats]);

  const avgFoodIntake = useMemo(() => {
    if (cats.length === 0) return 0;
    const sum = cats.reduce((acc, cat) => acc + (getTodayFood(cat) || 0), 0);
    return Math.round(sum / cats.length);
  }, [cats, stats]);

  const getWaterPercentage = (cat: Cat) => {
  // 1. UI와 동일하게 목표량이 null/undefined이면 기본값 100을 사용
  const target = cat.targetWaterIntake ?? 100; 
  const today = getTodayWater(cat);

  // 2. 목표량이 0일 경우 0%를 반환 (0으로 나누기 방지)
  if (target === 0) {
    return 0;
  }

  // 3. Math.min을 제거하여 100% 초과 표시 허용
  return (today / target) * 100;
};

const getFoodPercentage = (cat: Cat) => {
  // 1. UI와 동일하게 목표량이 null/undefined이면 기본값 100을 사용
  const target = cat.targetFoodIntake ?? 100;
  const today = getTodayFood(cat);

  // 2. 목표량이 0일 경우 0%를 반환 (0으로 나누기 방지)
  if (target === 0) {
    return 0;
  }

  // 3. Math.min을 제거하여 100% 초과 표시 허용
  return (today / target) * 100;
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
              고양이별 일일 음수/식사량
              {loading ? " 불러오는 중..." : error ? ` 오류: ${error}` : ""}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onGoToCatManagement}>
            관리하기
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">평균 음수량</span>
            </div>
            <div className="text-xl font-semibold text-blue-900">{avgWaterIntake} ml</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">평균 식사량</span>
            </div>
            <div className="text-xl font-semibold text-orange-900">{avgFoodIntake} g</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">모니터링할 고양이 선택</h3>
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCats.includes(cat.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCatSelection(cat.id)}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                  <ImageWithFallback
                    src={
                      cat.image ||
                      `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=32&h=32&fit=crop&crop=face`
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {selectedCats.length > 0 ? (
          <div className="space-y-6">
            {/* 개별 상세 */}
            <div>
              <h3 className="text-sm font-medium mb-3">개별 상세 정보</h3>
              {loading ? (
                        <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">통계 데이터를 불러오는 중...</p>
                </div>
              ) :(
              <div className="space-y-4">
                {selectedCatData.map((cat) => {
                  const todayWater = getTodayWater(cat);
                  const todayFood = getTodayFood(cat);
                  return (
                    <div key={cat.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          <ImageWithFallback
                            src={
                              cat.image ||
                              `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=32&h=32&fit=crop&crop=face`
                            }
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
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-[#8EE3CF]" />
                              <span className="text-xs text-muted-foreground">음수량(오늘)</span>
                            </div>
                            <span className="text-xs">
                              {todayWater}{/* 단위 확인 필요 */} ml
                              {" / "}
                              {cat.targetWaterIntake ?? 100} ml
                            </span>
                          </div>
                          <Progress
                            value={getWaterPercentage(cat)}
                            className="h-2 bg-slate-200 [&>div]:bg-[#8EE3CF]"
                          />
                          <div className="text-xs text-muted-foreground mt-1 text-right">
                            {getWaterPercentage(cat).toFixed(0)}% 달성
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <Coffee className="w-3 h-3 text-orange-600" />
                              <span className="text-xs text-muted-foreground">식사량(오늘)</span>
                            </div>
                            <span className="text-xs">
                              {todayFood}{/* 단위 확인 필요 */} g
                              {" / "}
                              {cat.targetFoodIntake ?? 100} g
                            </span>
                          </div>
                          <Progress
                            value={getFoodPercentage(cat)}
                            className="h-2 bg-slate-200 [&>div]:bg-[#8EE3CF]"
                          />
                          <div className="text-xs text-muted-foreground mt-1 text-right">
                            {getFoodPercentage(cat).toFixed(0)}% 달성
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
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
