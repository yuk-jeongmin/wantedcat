import { useState, useMemo, useEffect } from "react";
import axios from 'axios';
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Heart,
  MessageSquare,
  User,
  Bell,
  Shield,
  LogOut,
  Settings,
  Smartphone,
  Menu,
} from "lucide-react";
import { MainHeader } from "./components/MainHeader";
import { CategoryTabs } from "./components/CategoryTabs";
import { StatusTabs } from "./components/StatusTabs";
import { InlineSearch } from "./components/InlineSearch";
import { DashboardNotices } from "./components/DashboardNotices";
import { CatFeedingStats } from "./components/CatFeedingStats";
import type { Cat } from "./components/CatManagement";
import { CatManagement } from "./components/CatManagement";
import { AddCatForm } from "./components/AddCatForm";
import { DeviceManagement } from "./components/DeviceManagement";
import { AddDeviceForm } from "./components/AddDeviceForm";
import { Schedule } from "./components/Schedule";
import { Statistics } from "./components/Statistics";
import { MyPage } from "./components/MyPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { AdminPage } from "./components/AdminPage";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import type { Post } from "./components/PostCard";
import { PostCard } from "./components/PostCard";
import { PostTable } from "./components/PostTable";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostDetail } from "./components/PostDetail";
import type { Answer, Question } from "./components/QuestionForm";
import { QuestionTable } from "./components/QuestionTable";
import { QuestionBoard  } from "./components/QuestionBoard";
import { CreateQuestionForm } from "./components/CreateQuestionForm";
import type { Notice } from "./components/NoticeCard";
import { NoticeCard } from "./components/NoticeCard";
import { NoticeTable } from "./components/NoticeTable";
import { CreateNoticeForm } from "./components/CreateNoticeForm";
import { NoticeDetail } from "./components/NoticeDetail";
import { QuestionDetail } from "./components/QuestionDetail";
import type {
  BoardType,
  MenuType,
  ManagementType,
  AuthPage,
  UserData,
  Device,
} from "./types";
import { mockUsers } from "./data/mockUsers";
// import { initialPosts } from "./data/mockPosts";
// import { initialQuestions } from "./data/mockQuestions";
// import { initialNotices } from "./data/mockNotices";
import {
  canEditItem,
  canDeleteItem,
  canCreateNotice,
} from "./utils/permissions";
import {
  getBoardTitle,
  getCreateButtonText,
  getCurrentData,
  getCurrentCategories,
} from "./utils/boardUtils";
import {
  filterAndSortData,
  getCounts,
} from "./utils/dataFilters";
import { Toaster } from "sonner"; // 추가-jks : Toast 알림


axios.defaults.withCredentials = true;
const VITE_API_URL = import.meta.env.VITE_API_URL;

// 추가-jks : 고양이 프로필 사진 (도커 경로 -> 정적 URL 변환)
const dockerPathToPublicUrl = (p?: string) => {
  if (!p) return "";
  // "/app/public/USER/xxx.jpg" → "/public/USER/xxx.jpg"
  return p.startsWith("/app/") ? p.replace("/app", "") : p;
};

const asArray = <T,>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};
// --- [ADD] CSRF 토큰 & API 헬퍼 ---
const getCookie = (name: string) =>
  document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1] ?? "";

type Resource = "posts" | "questions" | "notices";

const axiosCfg = () => ({
  withCredentials: true,
  headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") }, // Spring Security 사용 시
});

// 조회수 +1
const apiIncrementView = async (resource: Resource, id: number) => {
  return axios.post(`/api/${resource}/${id}/view`, null, axiosCfg());
};

// 좋아요/취소 (서버가 POST/DELETE 패턴이라고 가정)
const apiLike = async (resource: Resource, id: number, like: boolean) => {
  if (like) return (await axios.post(`/api/${resource}/${id}/like`, null, axiosCfg())).data;
  return (await axios.delete(`/api/${resource}/${id}/like`, axiosCfg())).data;
};

// 낙관적 업데이트 유틸
const optimisticLikeUpdate = <T extends {id:number; likes?:number; likedByMe?:boolean}>(
  arr: T[], id: number, like: boolean
) => arr.map(i => i.id === id ? {
  ...i,
  likes: Math.max(0, (i.likes ?? 0) + (like ? 1 : -1)),
  likedByMe: like
} : i);

// Sidebar 컴포넌트: 사이드 메뉴를 렌더링합니다.
const Sidebar = ({
  currentUser,
  handleLogout,
  currentMenu,
  handleMenuChange,
  isManagementMenuOpen,
  setIsManagementMenuOpen,
  currentManagement,
  handleManagementChange,
  isBoardMenuOpen,
  setIsBoardMenuOpen,
  currentBoard,
  handleBoardChange,
}: any) => {
  return (
    <div className="w-full bg-white border-r border-border h-screen sticky top-0 flex flex-col">
        {/* 사용자 정보 섹션 */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-primary text-xl font-bold">캣밥바라기</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8"><Bell className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-left">
              <div className="font-semibold">{currentUser?.username}</div>
              <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">고양이 집사들의 공간</p>
        </div>
        
        {/* 네비게이션 메뉴 */}
        <div className="flex-1 p-3 overflow-y-auto">
           <nav className="space-y-1">
            {/* 대시보드 메뉴 아이템 */}
            <button onClick={() => handleMenuChange("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${currentMenu === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>대시보드</span>
            </button>
            
            {/* 관리 메뉴 (하위 메뉴 포함) */}
            <div>
              <button
                onClick={() => setIsManagementMenuOpen(!isManagementMenuOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium ${currentMenu === "management" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}
              >
                <span className="flex items-center gap-3"><Settings className="w-4 h-4" /><span>관리</span></span>
                {isManagementMenuOpen ? <ChevronDown className="w-4 h-4 text-primary-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </button>
              {isManagementMenuOpen && (
                <div className="ml-7 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                  {/* 고양이 관리 하위 메뉴 */}
                  <button onClick={() => handleManagementChange("cats")} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${currentMenu === "management" && currentManagement === "cats" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>
                    <div className="flex items-center gap-3"><Heart className="w-4 h-4" /><span>고양이</span></div>
                  </button>
                  {/* 장치 관리 하위 메뉴 */}
                  <button onClick={() => handleManagementChange("devices")} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${currentMenu === "management" && currentManagement === "devices" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>
                    <div className="flex items-center gap-3"><Smartphone className="w-4 h-4" /><span>장치</span></div>
                  </button>
                </div>
              )}
            </div>

            {/* 게시판 메뉴 (하위 메뉴 포함) */}
             <div>
              <button
                onClick={() => setIsBoardMenuOpen(!isBoardMenuOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium ${currentMenu === "board" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}
              >
                <span className="flex items-center gap-3"><MessageSquare className="w-4 h-4" /><span>게시판</span></span>
                {isBoardMenuOpen ? <ChevronDown className="w-4 h-4 text-primary-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </button>
              {isBoardMenuOpen && (
                <div className="ml-7 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                  {/* 정보게시판 하위 메뉴 */}
                  <button onClick={() => { handleMenuChange("board"); handleBoardChange("info"); }} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${currentMenu === "board" && currentBoard === "info" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>정보게시판</button>
                  {/* Q&A 하위 메뉴 */}
                  <button onClick={() => { handleMenuChange("board"); handleBoardChange("qna"); }} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${currentMenu === "board" && currentBoard === "qna" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>Q&A</button>
                  {/* 공지사항 하위 메뉴 */}
                  <button onClick={() => { handleMenuChange("board"); handleBoardChange("notice"); }} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${currentMenu === "board" && currentBoard === "notice" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>공지사항</button>
                </div>
              )}
            </div>
          
            {/* 마이페이지 메뉴 아이템 */}
            <button onClick={() => handleMenuChange("my-page")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${currentMenu === "my-page" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>
              <User className="w-4 h-4" />
              <span>마이페이지</span>
            </button>
            {/* 관리자 페이지 메뉴 아이템 (관리자만 표시) */}
            {currentUser?.role === "admin" && (
              <button onClick={() => handleMenuChange("admin")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${currentMenu === "admin" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100 text-foreground"}`}>
                <Shield className="w-4 h-4" />
                <span>관리자</span>
              </button>
            )}
          </nav>
        </div>
      </div>
  )
}

// MainContent 컴포넌트: 메인 콘텐츠 영역을 렌더링합니다.
const MainContent = ({
  title,
  currentMenu,
  currentManagement,
  cats,
  handleMenuChange,
  setCurrentManagement,
  devices,
  setShowAddDeviceForm,
  selectedDate,
  setEditingDevice,
  setEditingCat,
  currentUser,
  onUserUpdate,
  viewMode,
  setViewMode,
  filteredData,
  currentBoard,
  selectedStatus,
  selectedCategory,
  sortBy,
  setSortBy,
  setSelectedStatus,
  counts,
  setShowCreateForm,
  currentCategories,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  handleItemClick,
  handleEditClick,
  handleDeletePost,
  handleDeleteQuestion,
  handleDeleteNotice,
  setShowAddCatForm,
  handleDeleteCat,
  handleDeleteDevice,
  selectedMonitoringCats,
  setSelectedMonitoringCats,
}: any) => {
  const renderContent = () => {
    if (currentMenu === "dashboard") {
      return (
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* 대시보드 공지사항 */}
            <div>
              <DashboardNotices streamKey={currentUser?.streamKey}  userEmail={currentUser?.email} date={selectedDate}  />
            </div>
            {/* 고양이 식사량 통계 */}
            <div>
              <CatFeedingStats
                cats={cats}
                onGoToCatManagement={() => {
                  handleMenuChange("management");
                  setCurrentManagement("cats");
                }}
                selectedCats={selectedMonitoringCats}
                onCatSelectionChange={setSelectedMonitoringCats}
                userId={currentUser?.email || ''} 
              />
            </div>
          </div>
        </div>
      );
    }
    if (currentMenu === "management") {
      if (currentManagement === "cats") {
        return <CatManagement
        cats = {cats}
        onAddCat={() => setShowAddCatForm(true)}
        onEditCat={handleEditClick}
        onDeleteCat={handleDeleteCat} 
        currentUser={currentUser}/>;
      }
      if (currentManagement === "devices") {
        return <DeviceManagement 
        devices={devices}
        onAddDevice={() => setShowAddDeviceForm(true)}
        onEditDevice={handleEditClick} 
        onDeleteDevice={handleDeleteDevice} />;
      }
      return null;
    }
    if (currentMenu === "schedule") return <Schedule />;
    if (currentMenu === "statistics") return <Statistics cats={cats} />;
    if (currentMenu === "my-page") return <MyPage user={currentUser!} onUserUpdate={onUserUpdate} />;    // 마이페이지 수정
    if (currentMenu === "admin") {
      if (currentUser?.role !== "admin") {
        return <div className="flex-1 flex items-center justify-center"><div className="text-center"><div className="text-muted-foreground mb-4">관리자 권한이 필요합니다.</div></div></div>;
      }
      return <AdminPage />;
    }
    if (currentMenu !== "board") {
      return <div className="flex-1 flex items-center justify-center"><div className="text-center"><div className="text-muted-foreground mb-4">페이지 준비중입니다.</div></div></div>;
    }
    return (
      <>
        {/* 메인 헤더 */}
        <MainHeader viewMode={viewMode} onViewModeChange={setViewMode} postsCount={filteredData.length} selectedCategory={currentBoard === "qna" ? selectedStatus : selectedCategory} sortBy={sortBy} onSortChange={setSortBy} />
        {/* 카테고리/상태 탭 및 생성 버튼 */}
        {currentBoard === "qna" ? (
          <StatusTabs selectedStatus={selectedStatus} onStatusSelect={setSelectedStatus} questionCounts={counts} onCreateClick={() => setShowCreateForm(true)} createButtonText={getCreateButtonText(currentBoard)} />
        ) : currentBoard === "notice" ? (
          <CategoryTabs categories={currentCategories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} postCounts={counts} onCreateClick={canCreateNotice(currentUser) ? () => setShowCreateForm(true) : undefined} createButtonText={getCreateButtonText(currentBoard)} />
        ) : (
          <CategoryTabs categories={currentCategories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} postCounts={counts} onCreateClick={() => setShowCreateForm(true)} createButtonText={getCreateButtonText(currentBoard)} />
        )}
        {/* 콘텐츠 및 인라인 검색 */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white border-b border-border">
            {filteredData.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-muted-foreground mb-4">{searchTerm || selectedCategory || selectedStatus ? "검색 결과가 없습니다." : `${getBoardTitle(currentBoard)}에 게시물이 없습니다.`}</div>
                  {(currentBoard !== "notice" || (currentBoard === "notice" && canCreateNotice(currentUser))) && (<button onClick={() => setShowCreateForm(true)} className="text-primary hover:underline">첫 번째 게시물을 작성해보세요</button>)}
                </div>
              </div>
            ) : (
              <div className="p-6">
                {viewMode === "card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* 반응형 그리드 적용 */}
                    {filteredData.map((item: any) => {
                      if (currentBoard === "info") {
                        return <PostCard key={item.id} post={item as Post} onClick={() => handleItemClick(item)} canEdit={canEditItem(currentUser, item.author)} canDelete={canDeleteItem(currentUser, item.author)} onEdit={() => handleEditClick(item)} onDelete={() => handleDeletePost(item.id)} />;
                      }
                      if (currentBoard === "qna") {
                        return <QuestionBoard key={item.id} questions={[item as Question]} currentUser={currentUser}   />;
                      }
                      if (currentBoard === "notice") {
                        return <NoticeCard key={item.id} notice={item as Notice} onClick={() => handleItemClick(item)} canEdit={canEditItem(currentUser, item.author)} canDelete={canDeleteItem(currentUser, item.author)} onEdit={() => handleEditClick(item)} onDelete={() => handleDeleteNotice(item.id)} />;
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <>
                    {currentBoard === "info" && <PostTable posts={filteredData as Post[]} onPostClick={handleItemClick} currentUser={currentUser} onEdit={handleEditClick} onDelete={handleDeletePost} />}
                    {currentBoard === "qna" && <QuestionTable questions={filteredData as Question[]} onQuestionClick={handleItemClick} currentUser={currentUser} onEdit={handleEditClick} onDelete={handleDeleteQuestion} />}
                    {currentBoard === "notice" && <NoticeTable notices={filteredData as Notice[]} onNoticeClick={handleItemClick} currentUser={currentUser} onEdit={handleEditClick} onDelete={handleDeleteNotice} />}
                  </>
                )}
              </div>
            )}
            <InlineSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} resultsCount={filteredData.length} />
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="flex h-14 items-center gap-4 border-b bg-white px-6 sticky top-0">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {renderContent()}
      </main>
    </div>
  )
}

export default function App() {
  // 추가-jks : 웹페이지 초기 접속 시, 바로 로그인 창으로 가도록
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  // 기존 : React의 Mock 데이터를 사용해서 관리자로 접속되있는 상태
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  // const [currentUser, setCurrentUser] = useState<UserData | null>(mockUsers[1]);
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    const savedState = localStorage.getItem(key);
    try {
      return savedState ? JSON.parse(savedState) : defaultValue;
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return defaultValue;
    }
  };
 
  const [currentMenu, setCurrentMenu] = useState<MenuType>(getInitialState("currentMenu", "dashboard"));
  const [currentManagement, setCurrentManagement] = useState<ManagementType>(getInitialState("currentManagement", "cats"));
  const [currentBoard, setCurrentBoard] = useState<BoardType>(getInitialState("currentBoard", "info"));
  const [isManagementMenuOpen, setIsManagementMenuOpen] = useState<boolean>(getInitialState("isManagementMenuOpen", true));
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState<boolean>(getInitialState("isBoardMenuOpen", true));
 
  // 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("currentMenu", JSON.stringify(currentMenu));
    localStorage.setItem("currentManagement", JSON.stringify(currentManagement));
    localStorage.setItem("currentBoard", JSON.stringify(currentBoard));
    localStorage.setItem("isManagementMenuOpen", JSON.stringify(isManagementMenuOpen));
    localStorage.setItem("isBoardMenuOpen", JSON.stringify(isBoardMenuOpen));
  }, [currentMenu, currentManagement, currentBoard, isManagementMenuOpen, isBoardMenuOpen]);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);
  const [showAddCatForm, setShowAddCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedMonitoringCats, setSelectedMonitoringCats] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`/api/user/me`, { withCredentials: true });
        if (response.status === 200 && response.data) {
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setIsLoading(false); // 인증 확인 후 로딩 종료
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const fetchDevices = async () => {
    try {
      const response = await axios.get(`/api/devices`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setDevices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    }
  };

  const fetchCats = async () => {
    try {
      const response = await axios.get(`/api/cats`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch cats:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setPosts(asArray(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`/api/notices`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setNotices(asArray(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/questions`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setQuestions(asArray(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };


  //question answer 조회
  const fetchQuestinAnswers = async () => {
    try {
      if (!selectedQuestion) { return; } // No need to set answers state if not selected
      const response = await axios.get(`/api/questions/${selectedQuestion.id}/answers`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const fetchedAnswers = asArray(response.data);
        setQuestions(prevQuestions => prevQuestions.map(q =>
          q.id === selectedQuestion.id
            ? { ...q, answers: fetchedAnswers as Answer[] } // Update answers for the selected question
            : q
        ));
        // Also update selectedQuestion to reflect the new answers immediately
        setSelectedQuestion(prevSelected => prevSelected ? { ...prevSelected, answers: fetchedAnswers as Answer[] } : null);
      }
    } catch (error) {
      console.error("Failed to fetch answers:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices();
      fetchCats();
      fetchPosts();
      fetchNotices();
      fetchQuestions();
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   fetchPostComments();
  // }, [selectedPost]);

  useEffect(() => {
    fetchQuestinAnswers();
  }, [selectedQuestion?.id]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchCats = async () => {
                try {
                    const response = await axios.get(`/api/cats`, {
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        setCats(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch cats:", error);
                }
            };

            fetchCats();
        }
    }, [isAuthenticated]);
  ;

    useEffect(() => {
        if (isAuthenticated) {
            const fetchPosts = async () => {
                try {
                    const response = await axios.get(`/api/posts`, {
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        setPosts(asArray(response.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch posts:", error);
                }
            };

            fetchPosts();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchNotices = async () => {
                try {
                    const response = await axios.get(`/api/notices`, {
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        setNotices(asArray(response.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch notices:", error);
                }
            };

            fetchNotices();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchQustions = async () => {
                try {
                    const response = await axios.get(`/api/questions`, {
                        withCredentials: true,
                    });
                    if (response.status === 200) {
                        setQuestions(asArray(response.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch questions:", error);
                }
            };

            fetchQustions();
        }
    }, [isAuthenticated]);

    //post 댓글 조회
    useEffect(() => {
    
      const fetchPostComments = async () => {
          try {
               if (!selectedPost) { setComments([]); return; }
              const response = await axios.get(`/api/posts/${selectedPost.id}/comments`, {
                  withCredentials: true,
              });
              if (response.status === 200) {
                  setComments(asArray(response.data));
              }
          } catch (error) {
              console.error("Failed to fetch comments:", error);
          }
      };

      fetchPostComments();
      },[]);
      
  // 추가-jks : 고양이 프로필 사진 (고양이 목록을 화면에 뿌리기 전에 URL로 치환)
  const catsForRender = useMemo(() => {
    return (cats || []).map(c => ({
      ...c,
      image: dockerPathToPublicUrl(c.image), // 화면에서 사용할 URL로 치환
    }));
  }, [cats])
      

  const currentDataRaw = getCurrentData(currentBoard, posts, questions, notices);
  const currentData = asArray(currentDataRaw);                 // ✅ 항상 배열
  const currentCategories = getCurrentCategories(currentBoard, currentData);


  const counts = useMemo(() => {
    return getCounts(currentBoard, currentData, currentCategories);
  }, [currentBoard, posts, questions, notices, currentData, currentCategories]);

  const filteredData = useMemo(() => {
    return filterAndSortData(currentData, currentBoard, searchTerm, selectedCategory, selectedStatus, sortBy);
  }, [currentData, currentBoard, searchTerm, selectedCategory, selectedStatus, sortBy]);

const handleLoginAttempt = async (email: string, password: string): Promise<boolean> => {
    try {
      const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        const response = await axios.post(`/api/user/login`, params);

        if (response.status === 200) {
            const userResponse = await axios.get(`/api/user/me`, {
                withCredentials: true 
            });
            setCurrentUser(userResponse.data);
            setIsAuthenticated(true);
            return true;
        }
        return false;

    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
      return false;
    }
};

  const handleSignupAttempt = async (userData: {
    email: string;
    username: string;
    password: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(
        `/api/user/signup`, 
        userData
      );

      if (response.status === 201) {
        return { success: true };
      }
      return { success: false, message: "알 수 없는 오류가 발생했습니다." };

    } catch (error: any) {
      console.error("Signup failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: "서버와 통신 중 오류가 발생했습니다." };
    }
  };

  const handleLogout = async () => {
    try{
      await axios.post(`/api/user/logout`, {}, { withCredentials: true });
    } catch (error) { 
        console.error("Logout failed:", error); 
        } finally {  
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentMenu("dashboard");
      }
  };
 

  //마이페이지
  const handleUserUpdate = (updatedUser: UserData) => {
    setCurrentUser(updatedUser);
  };

  // [수정됨] 게시판 글 생성 함수 (API 연동 예시)
  const handleCreatePost = async (postData: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt">) => {
    try {
      const payload = {
        ...postData,
        author: currentUser?.username || postData.author,
      };
      const response = await axios.post(`/api/posts`, payload, { withCredentials: true });
      
      if (response.status === 200) {
        const newPost = response.data;
        setPosts(prev => [newPost, ...(Array.isArray(prev) ? prev : [])]);
        setShowCreateForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("게시글 생성에 실패했습니다.");
    }
  };

 const handleCreateQuestion = async (questionData: Omit<Question, "id" | "views" | "status" | "answers" | "createdAt">) => {
  try {
    const payload = {
      ...questionData,
      author: currentUser?.username || questionData.author,
    };
    // 백엔드의 Q&A 생성 API 엔드포인트로 요청합니다. (엔드포인트는 실제 API에 맞게 조정해야 할 수 있습니다.)
    const response = await axios.post(`/api/questions`, payload, { withCredentials: true });

    if (response.status === 200) {
      const newQuestion = response.data; // 서버로부터 받은 데이터 사용
      setQuestions(prev => [newQuestion, ...(Array.isArray(prev) ? prev : [])]);
      setShowCreateForm(false);
      fetchQuestions();
    }
  } catch (error) {
    console.error("Failed to create question:", error);
    alert("질문 생성에 실패했습니다.");
  }
};

// [수정됨] 공지사항 생성 함수 (API 연동)
  const handleCreateNotice = async (noticeData: Omit<Notice, "id" | "views" | "createdAt">) => {
    try {
      const payload = {
        ...noticeData,
        isPinned : noticeData.pinned,
        author: currentUser?.username || noticeData.author,
      };
      const response = await axios.post(`/api/notices`, payload, { withCredentials: true });

      if (response.status === 200) {
        const newNotice = response.data; // 서버로부터 받은 데이터 사용
        setNotices(prev => [newNotice, ...(Array.isArray(prev) ? prev : [])]);
        setShowCreateForm(false);
        fetchNotices();
      }
    } catch (error) {
      console.error("Failed to create notice:", error);
      alert("공지사항 생성에 실패했습니다.");
    }
  };
  const handleEditPost = async (
    postData: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt">
  ) => {
    if (!editingPost) return;
    try {
      const { data } = await axios.put(`/api/posts/${editingPost.id}`, postData, {
        withCredentials: true,
      });

      // 서버가 리스트를 돌려줄 수도(예: 갱신된 전체 목록) 있고, 단일 객체를 줄 수도 있음
      const list = asArray<Post>(data);
      if (list.length) {
        // ✅ 리스트가 오면 그대로 교체
        setPosts(list);
      } else {
        // ✅ 단일 객체면 기존 배열에서 해당 항목만 교체
        setPosts(prev => {
          const base = Array.isArray(prev) ? prev : asArray<Post>(prev); // 혹시라도 깨졌던 상태 복구
          return base.map(p => (p.id === editingPost.id ? { ...p, ...data } : p));
        });
      }

      setEditingPost(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("게시글 정보 수정에 실패했습니다.");
    }
  };

  const handleEditQuestion = async (
    questionData: Omit<Question, "id" | "views" | "status" | "answers" | "createdAt">
  ) => {
    if (!editingQuestion) return;
    console.log("Updating question:", { id: editingQuestion.id, author: questionData.author, data: questionData }); // Add this
    try {
      const { data } = await axios.put(
        `/api/questions/${editingQuestion.id}`,
        questionData,
        { withCredentials: true }
      );

      const list = asArray<Question>(data);
      if (list.length) {
        // 서버가 목록을 주면 그대로 교체
        setQuestions(list);
      } else {
        // 단일 객체면 해당 항목만 교체
        setQuestions(prev => {
          const base = Array.isArray(prev) ? prev : asArray<Question>(prev);
          return base.map(q => (q.id === editingQuestion.id ? { ...q, ...data } : q));
        });
      }

      setEditingQuestion(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update question:", error);
      alert("qna 정보 수정에 실패했습니다.");
    }
  };

  const handleEditNotice = async (
    noticeData: Omit<Notice, "id" | "views" | "createdAt">
  ) => {
    if (!editingNotice) return;
    try {

        const paramNoticeData = {
          author : noticeData.author,
          title : noticeData.title,
          content : noticeData.content,
          category : noticeData.category,
          priority : noticeData.priority,
          isPinned: noticeData.pinned
        }

      const { data } = await axios.put(
        `/api/notices/${editingNotice.id}`,
        paramNoticeData,
        { withCredentials: true }
      );

      const list = asArray<Notice>(data);
      if (list.length) {
        setNotices(list);
      } else {
        setNotices(prev => {
          const base = Array.isArray(prev) ? prev : asArray<Notice>(prev);
          return base.map(n => (n.id === editingNotice.id ? { ...n, ...data } : n));
        });
      }

      setEditingNotice(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to update notice:", error);
      alert("공지사항 정보 수정에 실패했습니다.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/posts/${postId}`, {
          params: { 
            author: currentUser?.username,
            userRole: currentUser?.role
           },
          withCredentials: true,
        });

        setPosts((prev) => prev.filter((post) => post.id !== postId));
        setSelectedPost(null);
      } catch (error) {
        console.log()
        console.error("Failed to delete post:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };
  
  const handleDeleteQuestion = async (questionId: number) => {
    if (window.confirm("정말 이 질문을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/questions/${questionId}`, {
          params: { 
            author: currentUser?.username,
            userRole: currentUser?.role
          },
          withCredentials: true,
        });

        setQuestions((prev) => prev.filter((question) => question.id !== questionId));
        setSelectedQuestion(null);
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert("질문 삭제에 실패했습니다.");
      }
    }
  };
  const handleDeleteNotice = async (noticeId: number) => {
    if (window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      console.log("Deleting notice:", { noticeId, author: currentUser?.username }); // Updated log
      try {
        await axios.delete(`/api/notices/${noticeId}`, {
          params: { 
            author: currentUser?.username
           },
          withCredentials: true,
        });

        setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
        setSelectedNotice(null);
      } catch (error) {
        console.error("Failed to delete notice:", error);
        alert("공지 삭제에 실패했습니다.");
      }
    }
  };

  const handleQuestionAnswered = (updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    setSelectedQuestion(null); // Close the detail view
  };

  // [수정됨] 고양이 추가: API 요청 후 상태 업데이트 (안전한 방식)
  const handleAddCat = async (catData: Omit<Cat, "id" | "lastCheckup">) => {
    try {
      const payload = {
        name: catData.name,
        breed: catData.breed,
        gender: catData.gender,
        age: Number(catData.age),
        weight: Number(catData.weight),
        healthStatus: catData.healthStatus,
        memo: catData.memo,
        image: catData.image,
        aiDataFile: ""
      };

      const response = await axios.post(`/api/cats`, payload, { withCredentials: true });

      if (response.status === 201) {
        const newCat = response.data;
        setCats((prev) => [newCat, ...prev]);
        setShowAddCatForm(false);
      }
    } catch (error) {
      console.error("Failed to add cat:", error);
      alert("고양이 추가에 실패했습니다.");
    }
  };

  // [수정됨] 고양이 수정: API 요청 후 상태 업데이트 (안전한 방식)
  const handleUpdateCat = async (catData: Omit<Cat, "id" | "lastCheckup">) => {
    if (editingCat) {
      try {
        const response = await axios.put(`/api/cats/${editingCat.id}`, catData, {
          withCredentials: true,
        });
        
        const updatedCat = response.data;
        setCats((prev) => 
          prev.map((cat) => 
            cat.id === editingCat.id ? updatedCat : cat
          )
        );

        setEditingCat(null);
        setShowAddCatForm(false);
      } catch (error) {
        console.error("Failed to update cat:", error);
        alert("고양이 정보 수정에 실패했습니다.");
      }
    }
  };
  
  // [수정됨] 고양이 삭제: API 요청 후 상태 업데이트 (안전한 방식)
  const handleDeleteCat = async (catId: number) => {
    if (window.confirm("정말 이 고양이를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/cats/${catId}`, {
          withCredentials: true,
        });

        setCats((prev) => prev.filter((cat) => cat.id !== catId));
      } catch (error) {
        console.error("Failed to delete cat:", error);
        alert("고양이 삭제에 실패했습니다.");
      }
    }
  };

  const handleAddDevice = async (deviceData: Omit<Device, "id">) => {
    try {
      const response = await axios.post(`/api/devices`, deviceData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        const newDevice = response.data;
        setDevices((prev) => [newDevice, ...prev]);
        setShowAddDeviceForm(false);
      }
    } catch (error) {
      console.error("Failed to add device:", error);
      alert("장치 추가에 실패했습니다.");
    }
  };

  const handleUpdateDevice = async (deviceData: Omit<Device, "id" | "lastConnected">) => {
    if (editingDevice) {
      try {
        const response = await axios.put(`/api/devices/${editingDevice.id}`, deviceData, {
          withCredentials: true,
        });

        setDevices((prev) => 
          prev.map((device) => 
            device.id === editingDevice.id ? response.data : device
          )
        );
        
        setEditingDevice(null);
        setShowAddDeviceForm(false);
      } catch (error) {
        console.error("Failed to update device:", error);
        alert("장치 정보 수정에 실패했습니다.");
      }
    }
  };

  const handleDeleteDevice = async (deviceId: number) => {
    if (window.confirm("정말 이 장치를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/devices/${deviceId}`, {
          withCredentials: true,
        });

        setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      } catch (error) {
        console.error("Failed to delete device:", error);
        alert("장치 삭제에 실패했습니다.");
      }
    }
  };

  // --- [REPLACE] 기존 handleItemClick 전체 교체 ---
const handleItemClick = async (item: Post | Question | Notice) => {
  if (currentBoard === "info") {
    const it = item as Post;
    // 1) 화면 먼저 증가(낙관적)
    setPosts(prev => prev.map(p => p.id === it.id ? { ...p, views: (p.views ?? 0) + 1 } : p));
    setSelectedPost({ ...it, views: (it.views ?? 0) + 1 });

    // 2) 서버 반영
    try {
      const { data: updated } = await apiIncrementView("posts", it.id);
      if (updated) {
        setPosts(prev => prev.map(p => p.id === it.id ? { ...p, ...updated } : p));
        setSelectedPost(prev => prev && prev.id === it.id ? { ...prev, ...updated } : prev);
      }
    } catch (e) {
      console.error("increase post views failed", e);
      // 실패 시 롤백하고 싶으면 아래 사용
      // setPosts(prev => prev.map(p => p.id === it.id ? { ...p, views: Math.max(0, (p.views ?? 1) - 1) } : p));
    }
  } else if (currentBoard === "qna") {
    const it = item as Question;
    setQuestions(prev => prev.map(q => q.id === it.id ? { ...q, views: (q.views ?? 0) + 1 } : q));
    setSelectedQuestion({ ...it, views: (it.views ?? 0) + 1 });

    try {
      const { data: updated } = await apiIncrementView("questions", it.id);
      if (updated) {
        setQuestions(prev => prev.map(q => q.id === it.id ? { ...q, ...updated } : q));
        setSelectedQuestion(prev => prev && prev.id === it.id ? { ...prev, ...updated } : prev);
      }
    } catch (e) {
      console.error("increase question views failed", e);
    }
  } else if (currentBoard === "notice") {
    const it = item as Notice;
    setNotices(prev => prev.map(n => n.id === it.id ? { ...n, views: (n.views ?? 0) + 1 } : n));
    setSelectedNotice({ ...it, views: (it.views ?? 0) + 1 });

    try {
      const { data: updated } = await apiIncrementView("notices", it.id);
      if (updated) {
        setNotices(prev => prev.map(n => n.id === it.id ? { ...n, ...updated } : n));
        setSelectedNotice(prev => prev && prev.id === it.id ? { ...prev, ...updated } : prev);
      }
    } catch (e) {
      console.error("increase notice views failed", e);
    }
  }
};


const handleEditClick = (item: any) => {
  if (currentMenu === "management") {
    if (currentManagement === "cats") {
      setEditingCat(item);
      setShowAddCatForm(true);
      return;
    }
    if (currentManagement === "devices") {
      setEditingDevice(item);
      setShowAddDeviceForm(true);
      return;
    }
  }

  if (currentMenu === "board") {
    if (currentBoard === "info") {
      setEditingPost(item);
      setShowCreateForm(true);
      return;
    }
    if (currentBoard === "qna") {
      setEditingQuestion(item);
      setShowCreateForm(true);
      return;
    }
    if (currentBoard === "notice") {
      setEditingNotice(item);
      setShowCreateForm(true);
      return;
    }
  }
};

  const handleBoardChange = (board: BoardType) => {
    setCurrentBoard(board);
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchTerm("");
    setSortBy("latest");
    setViewMode(board === "info" || board === "qna" || board === "notice" ? "table" : "card");
  };

  const handleMenuChange = (menu: MenuType) => {
    setCurrentMenu(menu);
    if (menu !== "board" && menu !== "management") {
      setSelectedCategory(null);
      setSelectedStatus(null);
      setSearchTerm("");
      setSortBy("latest");
    }
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };

  const handleManagementChange = (management: ManagementType) => {
    setCurrentManagement(management);
    setCurrentMenu("management");
     if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };
    
  const getMenuTitle = (menu: MenuType, management: ManagementType, board: BoardType): string => {
    switch (menu) {
      case "dashboard": return "대시보드";
      case "management":
        switch (management) {
          case "cats": return "고양이 관리";
          case "devices": return "장치 관리";
          default: return "관리";
        }
      case "board": return getBoardTitle(board);
      case "my-page": return "마이페이지";
      case "admin": return "관리자 페이지";
      default: return "캣밥바라기";
    }
  };

  if (!isAuthenticated) {
    if (authPage === "login") {
      return <LoginPage onLogin={handleLoginAttempt} onGoToSignup={() => setAuthPage("signup")} />;
    } else {
      return <SignupPage onSignup={handleSignupAttempt} onGoToLogin={() => setAuthPage("login")} />;
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="flex">
        {/* 데스크탑 사이드바 */}
        <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
            <div className="w-64 h-full overflow-hidden">
                <Sidebar
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                    currentMenu={currentMenu}
                    handleMenuChange={handleMenuChange}
                    isManagementMenuOpen={isManagementMenuOpen}
                    setIsManagementMenuOpen={setIsManagementMenuOpen}
                    currentManagement={currentManagement}
                    handleManagementChange={handleManagementChange}
                    isBoardMenuOpen={isBoardMenuOpen}
                    setIsBoardMenuOpen={setIsBoardMenuOpen}
                    currentBoard={currentBoard}
                    handleBoardChange={handleBoardChange}
                />
            </div>
        </div>

        {/* 모바일 사이드바 (오버레이) */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <Sidebar
                currentUser={currentUser}
                handleLogout={handleLogout}
                currentMenu={currentMenu}
                handleMenuChange={handleMenuChange}
                isManagementMenuOpen={isManagementMenuOpen}
                setIsManagementMenuOpen={setIsManagementMenuOpen}
                currentManagement={currentManagement}
                handleManagementChange={handleManagementChange}
                isBoardMenuOpen={isBoardMenuOpen}
                setIsBoardMenuOpen={setIsBoardMenuOpen}
                currentBoard={currentBoard}
                handleBoardChange={handleBoardChange}
            />
        </div>
        {isSidebarOpen && (
            <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/60 md:hidden" />
        )}

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1">
            <MainContent
              title={getMenuTitle(currentMenu, currentManagement, currentBoard)}
              currentMenu={currentMenu}
              currentManagement={currentManagement}
              cats={catsForRender} // 변경-jks : cats -> catsForRender : 고양이 프로필 사진(고양이 목록을 화면에 뿌리기 전 URL로 치환)
              handleMenuChange={handleMenuChange}
              setCurrentManagement={setCurrentManagement}
              devices={devices}
              setShowAddDeviceForm={setShowAddDeviceForm}
              setEditingDevice={setEditingDevice}
              setEditingCat = {setEditingCat}
              currentUser={currentUser}
              onUserUpdate={handleUserUpdate}
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredData={filteredData}
              currentBoard={currentBoard}
              selectedStatus={selectedStatus}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setSelectedStatus={setSelectedStatus}
              counts={counts}
              setShowCreateForm={setShowCreateForm}
              currentCategories={currentCategories}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleItemClick={handleItemClick}
              handleEditClick={handleEditClick}
              handleDeletePost={handleDeletePost}
              handleDeleteQuestion={handleDeleteQuestion}
              handleDeleteNotice={handleDeleteNotice}
              setShowAddCatForm={setShowAddCatForm}
              handleDeleteCat={handleDeleteCat}
              handleDeleteDevice={handleDeleteDevice}
              selectedMonitoringCats={selectedMonitoringCats}
              setSelectedMonitoringCats={setSelectedMonitoringCats}
              selectedDate={selectedDate} 
            />
        </main>
      </div>

      {/* 모바일 사이드바 토글 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-5 left-5 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 추가-jks : Toast 알림 */}
      <Toaster position="top-center" closeButton richColors />

      {/* --- 폼 및 모달 --- */}
      
      {/* 글/질문/공지 생성 및 수정 폼 */}
      {currentMenu === "board" && showCreateForm && currentBoard === "info" && (<CreatePostForm onClose={() => { setShowCreateForm(false); setEditingPost(null); }} onSubmit={editingPost ? handleEditPost : handleCreatePost} editingPost={editingPost} />)}
      {currentMenu === "board" && showCreateForm && currentBoard === "qna" && (<CreateQuestionForm onClose={() => { setShowCreateForm(false); setEditingQuestion(null); }} onSubmit={editingQuestion ? handleEditQuestion : handleCreateQuestion} editingQuestion={editingQuestion} />)}
      {currentMenu === "board" && showCreateForm && currentBoard === "notice" && canCreateNotice(currentUser) && (<CreateNoticeForm onClose={() => { setShowCreateForm(false); setEditingNotice(null); }} onSubmit={editingNotice ? handleEditNotice : handleCreateNotice} editingNotice={editingNotice} />)}
      
      {/* 고양이/장치 추가 및 수정 폼 */}
      {showAddCatForm && (
        <AddCatForm 
          onClose={() => { setShowAddCatForm(false); setEditingCat(null); }} 
          onSubmit={editingCat ? handleUpdateCat : handleAddCat} 
          editingCat={editingCat} 
          userId={currentUser?.id ?? currentUser?.email} // 추가-jks : 백엔드에서 사용할 식별자
        />
      )}
      {showAddDeviceForm && (<AddDeviceForm onClose={() => { setShowAddDeviceForm(false); setEditingDevice(null); }} 
                    onSubmit={editingDevice ? handleUpdateDevice : handleAddDevice} editingDevice={editingDevice} streamKey={currentUser?.streamKey} user_email={currentUser?.email}/>)}
      
      {/* --- 상세 보기 모달 --- */}
      {selectedPost && (
        <PostDetail
          item={posts.find((p) => p.id === selectedPost.id) || selectedPost}
          onBack={() => setSelectedPost(null)}
          canEdit={canEditItem(currentUser, selectedPost.author)}
          canDelete={canDeleteItem(currentUser, selectedPost.author)}
          onEdit={() => handleEditClick(selectedPost)}
          onDelete={() => handleDeletePost(selectedPost.id)}
          loggedInUsername={currentUser?.username}
        />
      )}
      
      {selectedQuestion && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-49 flex justify-center items-center p-4"
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <QuestionDetail
              question={questions.find((q) => q.id === selectedQuestion.id) || selectedQuestion}
              onBack={() => setSelectedQuestion(null)}
              canEdit={canEditItem(currentUser, selectedQuestion.author)}
              canDelete={canDeleteItem(currentUser, selectedQuestion.author)}
              onEdit={() => handleEditClick(selectedQuestion)}
              onDelete={() => handleDeleteQuestion(selectedQuestion.id)}
              currentUser={currentUser}
              onAnswerSubmitted={handleQuestionAnswered}
            />
          </div>
        </div>
      )}

      {selectedNotice && (
        <NoticeDetail
          notice={notices.find((n) => n.id === selectedNotice.id) || selectedNotice}
          onBack={() => setSelectedNotice(null)}
          canEdit={canEditItem(currentUser, selectedNotice.author)}
          canDelete={canDeleteItem(currentUser, selectedNotice.author)}
          onEdit={() => handleEditClick(selectedNotice)}
          onDelete={() => handleDeleteNotice(selectedNotice.id)}
        />
      )}
  </div>
  );
}