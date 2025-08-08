import type { Post } from '../components/PostCard';

export const initialPosts: Post[] = [
  {
    id: 1,
    title: "우리 고양이가 좋아하는 장난감 BEST 5",
    content: "집에서 키우는 고양이들이 가장 좋아하는 장난감들을 소개합니다. 낚싯대 장난감, 터널, 캣닢 쿠션, 레이저 포인터, 그리고 골판지 박스까지! 각 장난감의 장단점과 고양이별 성향에 맞는 선택법을 알려드립니다. 우리 냥이가 더 활발하고 건강하게 놀 수 있도록 도와주세요.",
    author: "김집사",
    createdAt: "2025-01-20T09:00:00Z",
    category: "장난감 추천",
    views: 245,
    likes: 18,
    comments: 7
  },
  {
    id: 2,
    title: "고양이 건강검진 체크리스트와 주의사항",
    content: "정기적인 건강검진은 고양이의 건강한 삶을 위해 필수입니다. 연령별 검진 주기, 필수 검사 항목, 백신 스케줄, 그리고 집에서 확인할 수 있는 건강 체크포인트들을 정리했습니다. 수의사 선택 팁과 비용 절약 방법도 함께 공유드립니다.",
    author: "펫케어전문가",
    createdAt: "2025-01-19T14:30:00Z",
    category: "건강 관리",
    views: 182,
    likes: 23,
    comments: 12
  },
  {
    id: 3,
    title: "겨울철 고양이 관리법 완벽 가이드",
    content: "추운 겨울, 우리 고양이들을 따뜻하고 건강하게 관리하는 방법을 알아보세요. 적정 실내온도, 습도 관리, 겨울철 털갈이 대처법, 그리고 활동량 유지를 위한 실내 놀이 아이디어까지 총정리했습니다.",
    author: "고양이박사",
    createdAt: "2025-01-18T11:15:00Z",
    category: "계절 관리",
    views: 156,
    likes: 14,
    comments: 8
  }
];