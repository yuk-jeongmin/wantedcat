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
  userId?: string;
}

// 백엔드 응답 타입
type DailyCatStats = {
  catName: string;
  totalWaterIntake: number; // 현재 백엔드는 durationSeconds 합(초)로 내려줄 가능성 있음
  totalFoodIntake: number;  // 동일
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const base = API_BASE_URL || ""; // 빈 문자열이면 상대경로 사용

export function CatFeedingStats({
  cats,
  onGoToCatManagement,
  selectedCats,
  onCatSelectionChange,
  userId: userIdProp, 
}: CatFeedingStatsProps) {
  const [stats, setStats] = useState<Record<string, DailyCatStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 오늘 날짜(로컬) → YYYY-MM-DD
  const todayStr = useMemo(() => {
    // 한국 로케일에서 YYYY-MM-DD 를 얻기 위해 en-CA 사용
    return new Date().toLocaleDateString("en-CA"); // e.g., 2025-08-20
  }, []);

  // userId 추적: 앱 로그인 시 저장한 값을 사용 (필요 시 수정)
  const userId = useMemo(() => {
    return (
      userIdProp ||
      localStorage.getItem("userId") ||
      localStorage.getItem("email") ||
      ""
    );
  }, [userIdProp]);

  // 이벤트 통계 불러오기
  useEffect(() => {
    if (!API_BASE_URL || !userId) {
      // API 또는 userId 없으면 요청하지 않음
      return;
    }
    const controller = new AbortController();

    async function fetchDailyStats() {
      setLoading(true);
      setError(null);
      try {
        const url = `${base}/api/events/stats?userId=${encodeURIComponent(userId)}&date=${todayStr}`;
        const res = await fetch(url, {
            method: 'GET',              // 로그인은 POST
            credentials: 'include',     // ★ 세션 쿠키 주고/받기
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: DailyCatStats[] = await res.json();

        // catName 기준으로 빠른 조회를 위해 map 구성
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
  }, [API_BASE_URL, userId, todayStr]);

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
    if (!cat.targetWaterIntake) return 0;
    const today = getTodayWater(cat);
    return Math.min((today / cat.targetWaterIntake) * 100, 100);
  };

  const getFoodPercentage = (cat: Cat) => {
    if (!cat.targetFoodIntake) return 0;
    const today = getTodayFood(cat);
    return Math.min((today / cat.targetFoodIntake) * 100, 100);
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
              (이벤트 데이터 기준) 고양이별 일일 음수/식사량
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
                              <Droplets className="w-3 h-3 text-blue-600" />
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
                            className="h-2 bg-slate-200 [&>div]:bg-blue-500"
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
                            className="h-2 bg-slate-200 [&>div]:bg-orange-500"
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
