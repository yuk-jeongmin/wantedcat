import type { Notice } from '../components/NoticeCard';

export const initialNotices: Notice[] = [
  {
    id: 1,
    title: "고양이 커뮤니티 정기 모임 안내 (1월 25일 오후 2시)",
    content: "안녕하세요! 고양이 사랑하는 분들의 정기 모임을 개최합니다.\n\n일시: 2025년 1월 25일(토) 오후 2시 ~ 5시\n장소: 강남구 펫카페 '냥냥월드'\n내용: 고양이 건강 관리 세미나, 경험담 나누기, 친목 도모\n참가비: 1만원 (음료 및 간식 포함)\n\n참석을 원하시는 분은 댓글로 신청해주세요. 고양이 동반 가능합니다!",
    author: "관리자",
    createdAt: "2025-01-20T15:00:00Z",
    category: "모임 안내",
    views: 1250,
    priority: "긴급",
    pinned: true
  },
  {
    id: 2,
    title: "겨울철 길고양이 급식소 운영 안내",
    content: "추운 겨울을 맞아 지역 길고양이들을 위한 급식소를 운영합니다.\n\n운영 기간: 2025년 1월 ~ 3월\n급식 시간: 매일 오전 7시, 오후 6시\n급식 장소: 공원 입구 고양이 쉼터\n\n자원봉사자와 사료 후원을 받고 있습니다. 많은 관심과 참여 부탁드립니다.",
    author: "길고양이보호단체",
    createdAt: "2025-01-18T10:00:00Z",
    category: "봉사활동",
    views: 892,
    priority: "중요",
    pinned: false
  },
  {
    id: 3,
    title: "커뮤니티 이용 규칙 업데이트",
    content: "더 나은 커뮤니티 환경을 위해 이용 규칙이 일부 업데이트되었습니다.\n\n주요 변경사항:\n1. 분양/입양 관련 게시물은 전용 게시판 이용\n2. 상업적 광고 게시물 금지\n3. 타인 비방이나 부적절한 내용 게시 시 제재\n\n건전한 고양이 커뮤니티 만들기에 함께해주세요.",
    author: "관리자",
    createdAt: "2025-01-15T14:00:00Z",
    category: "운영 안내",
    views: 567,
    priority: "일반",
    pinned: false
  }
];