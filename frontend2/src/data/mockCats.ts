import type { Cat } from '../components/CatManagement';

export const initialCats: Cat[] = [
  {
    id: 1,
    name: "나비",
    breed: "러시안블루",
    age: "3년 2개월",
    weight: "4.2kg",
    gender: "female",
    healthStatus: "healthy",
    lastCheckup: "2025-01-15",
    notes: "활발하고 건강한 상태",
    specialNotes: "매우 활발하고 사람을 좋아함. 높은 곳에 올라가는 것을 좋아함.",
    dailyWaterIntake: 280,
    dailyFoodIntake: 85,
    targetWaterIntake: 300,
    targetFoodIntake: 90
  },
  {
    id: 2,
    name: "택시",
    breed: "페르시안",
    age: "2년 8개월",
    weight: "3.8kg", 
    gender: "male",
    healthStatus: "caution",
    lastCheckup: "2025-01-10",
    notes: "최근 식욕부진 증상",
    specialNotes: "털이 많아 정기적인 브러싱 필요. 최근 식욕부진으로 관찰 중.",
    dailyWaterIntake: 180,
    dailyFoodIntake: 55,
    targetWaterIntake: 270,
    targetFoodIntake: 80
  },
  {
    id: 3,
    name: "김치",
    breed: "아메리칸숏헤어",
    age: "1년 6개월",
    weight: "3.2kg",
    gender: "female", 
    healthStatus: "healthy",
    lastCheckup: "2025-01-18",
    notes: "예방접종 완료",
    specialNotes: "새끼 고양이로 매우 장난기가 많음. 사회화 훈련 중.",
    dailyWaterIntake: 240,
    dailyFoodIntake: 70,
    targetWaterIntake: 250,
    targetFoodIntake: 75
  },
  {
    id: 4,
    name: "털볼이",
    breed: "메인쿤",
    age: "4년 1개월",
    weight: "5.8kg",
    gender: "male",
    healthStatus: "sick",
    lastCheckup: "2025-01-20",
    notes: "정기 치료 중",
    specialNotes: "관절염으로 치료 중. 계단 이용 시 도움 필요.",
    dailyWaterIntake: 320,
    dailyFoodIntake: 95,
    targetWaterIntake: 350,
    targetFoodIntake: 110
  }
];