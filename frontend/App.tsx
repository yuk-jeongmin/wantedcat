import { useState, useMemo } from "react";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Camera,
  Calendar as CalendarIcon,
  BarChart3,
  User,
  Bell,
  Shield,
  LogOut,
  Settings,
  Smartphone,
} from "lucide-react";
import { MainHeader } from "./components/MainHeader";
import { CategoryTabs } from "./components/CategoryTabs";
import { StatusTabs } from "./components/StatusTabs";
import { InlineSearch } from "./components/InlineSearch";
import { DashboardNotices } from "./components/DashboardNotices";
import { CatFeedingStats } from "./components/CatFeedingStats";
import { CatManagement, Cat } from "./components/CatManagement";
import { AddCatForm } from "./components/AddCatForm";
import { DeviceManagement } from "./components/DeviceManagement";
import { AddDeviceForm } from "./components/AddDeviceForm";
import { HomeCam } from "./components/HomeCam";
import { Schedule } from "./components/Schedule";
import { Statistics } from "./components/Statistics";
import { MyPage } from "./components/MyPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { AdminPage } from "./components/AdminPage";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

// Information Board
import { PostCard, Post } from "./components/PostCard";
import { PostTable } from "./components/PostTable";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostDetail } from "./components/PostDetail";

// Q&A Board
import {
  QuestionCard,
  Question,
} from "./components/QuestionCard";
import { QuestionTable } from "./components/QuestionTable";
import { CreateQuestionForm } from "./components/CreateQuestionForm";
import { QuestionDetail } from "./components/QuestionDetail";

// Notice Board
import { NoticeCard, Notice } from "./components/NoticeCard";
import { NoticeTable } from "./components/NoticeTable";
import { CreateNoticeForm } from "./components/CreateNoticeForm";
import { NoticeDetail } from "./components/NoticeDetail";

// Types
import type {
  BoardType,
  MenuType,
  ManagementType,
  AuthPage,
  UserData,
  Device,
} from "./types";

// Data
import { mockUsers } from "./data/mockUsers";
import { initialCats } from "./data/mockCats";
import { initialDevices } from "./data/mockDevices";
import { initialPosts } from "./data/mockPosts";
import { initialQuestions } from "./data/mockQuestions";
import { initialNotices } from "./data/mockNotices";

// Utils
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
import {
  handleLogin as authLogin,
  handleSignup as authSignup,
} from "./utils/auth";

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<UserData | null>(mockUsers[1]); // 관리자로 로그인
  const [authPage, setAuthPage] = useState<AuthPage>("login");

  // App states
  const [currentMenu, setCurrentMenu] =
    useState<MenuType>("dashboard");
  const [currentManagement, setCurrentManagement] =
    useState<ManagementType>("cats");
  const [currentBoard, setCurrentBoard] =
    useState<BoardType>("info");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<
    string | null
  >(null);
  const [viewMode, setViewMode] = useState<"card" | "table">(
    "table",
  );
  const [sortBy, setSortBy] = useState<string>("latest");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(true);
  const [isManagementMenuOpen, setIsManagementMenuOpen] =
    useState(true);

  // Cat management states
  const [cats, setCats] = useState<Cat[]>(initialCats);
  const [showAddCatForm, setShowAddCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(
    null,
  );

  // Device management states
  const [devices, setDevices] =
    useState<Device[]>(initialDevices);
  const [showAddDeviceForm, setShowAddDeviceForm] =
    useState(false);
  const [editingDevice, setEditingDevice] =
    useState<Device | null>(null);

  // Data states
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);
  const [notices, setNotices] =
    useState<Notice[]>(initialNotices);

  // Detail states
  const [selectedPost, setSelectedPost] = useState<Post | null>(
    null,
  );
  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);
  const [selectedNotice, setSelectedNotice] =
    useState<Notice | null>(null);

  // Edit states
  const [editingPost, setEditingPost] = useState<Post | null>(
    null,
  );
  const [editingQuestion, setEditingQuestion] =
    useState<Question | null>(null);
  const [editingNotice, setEditingNotice] =
    useState<Notice | null>(null);

  // Get current data and categories
  const currentData = getCurrentData(
    currentBoard,
    posts,
    questions,
    notices,
  );
  const currentCategories = getCurrentCategories(
    currentBoard,
    currentData,
  );

  // Move all useMemo hooks to the top level before any conditional returns
  const counts = useMemo(() => {
    return getCounts(
      currentBoard,
      currentData,
      currentCategories,
    );
  }, [
    currentBoard,
    posts,
    questions,
    notices,
    currentData,
    currentCategories,
  ]);

  const filteredData = useMemo(() => {
    return filterAndSortData(
      currentData,
      currentBoard,
      searchTerm,
      selectedCategory,
      selectedStatus,
      sortBy,
    );
  }, [
    currentData,
    currentBoard,
    searchTerm,
    selectedCategory,
    selectedStatus,
    sortBy,
  ]);

  // Authentication functions
  const handleLoginAttempt = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const user = await authLogin(email, password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSignupAttempt = async (userData: {
    email: string;
    name: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    return await authSignup(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentMenu("dashboard");
  };

  // Handle create functions
  const handleCreatePost = (
    postData: Omit<
      Post,
      "id" | "views" | "likes" | "comments" | "createdAt"
    >,
  ) => {
    const newPost: Post = {
      ...postData,
      author: currentUser?.name || postData.author,
      id: Math.max(...posts.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleCreateQuestion = (
    questionData: Omit<
      Question,
      "id" | "views" | "status" | "answers" | "createdAt"
    >,
  ) => {
    const newQuestion: Question = {
      ...questionData,
      author: currentUser?.name || questionData.author,
      id: Math.max(...questions.map((q) => q.id)) + 1,
      createdAt: new Date().toISOString(),
      status: "접수",
      views: 0,
      answers: [],
    };
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleCreateNotice = (
    noticeData: Omit<Notice, "id" | "views" | "createdAt">,
  ) => {
    const newNotice: Notice = {
      ...noticeData,
      author: currentUser?.name || noticeData.author,
      id: Math.max(...notices.map((n) => n.id)) + 1,
      createdAt: new Date().toISOString(),
      views: 0,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  // Handle edit functions
  const handleEditPost = (
    postData: Omit<
      Post,
      "id" | "views" | "likes" | "comments" | "createdAt"
    >,
  ) => {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? { ...post, ...postData }
            : post,
        ),
      );
      setEditingPost(null);
      setShowCreateForm(false);
    }
  };

  const handleEditQuestion = (
    questionData: Omit<
      Question,
      "id" | "views" | "status" | "answers" | "createdAt"
    >,
  ) => {
    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((question) =>
          question.id === editingQuestion.id
            ? { ...question, ...questionData }
            : question,
        ),
      );
      setEditingQuestion(null);
      setShowCreateForm(false);
    }
  };

  const handleEditNotice = (
    noticeData: Omit<Notice, "id" | "views" | "createdAt">,
  ) => {
    if (editingNotice) {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === editingNotice.id
            ? { ...notice, ...noticeData }
            : notice,
        ),
      );
      setEditingNotice(null);
      setShowCreateForm(false);
    }
  };

  // Handle delete functions
  const handleDeletePost = (postId: number) => {
    if (confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      setPosts((prev) =>
        prev.filter((post) => post.id !== postId),
      );
      setSelectedPost(null);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("정말 이 질문을 삭제하시겠습니까?")) {
      setQuestions((prev) =>
        prev.filter((question) => question.id !== questionId),
      );
      setSelectedQuestion(null);
    }
  };

  const handleDeleteNotice = (noticeId: number) => {
    if (confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      setNotices((prev) =>
        prev.filter((notice) => notice.id !== noticeId),
      );
      setSelectedNotice(null);
    }
  };

  // Handle cat functions
  const handleAddCat = (
    catData: Omit<Cat, "id" | "lastCheckup">,
  ) => {
    const newCat: Cat = {
      ...catData,
      id: Math.max(...cats.map((c) => c.id)) + 1,
      lastCheckup: new Date().toISOString().split("T")[0],
    };
    setCats((prev) => [newCat, ...prev]);
    setShowAddCatForm(false);
  };

  const handleEditCat = (cat: Cat) => {
    setEditingCat(cat);
    setShowAddCatForm(true);
  };

  const handleUpdateCat = (
    catData: Omit<Cat, "id" | "lastCheckup">,
  ) => {
    if (editingCat) {
      setCats((prev) =>
        prev.map((cat) =>
          cat.id === editingCat.id
            ? {
                ...catData,
                id: editingCat.id,
                lastCheckup: editingCat.lastCheckup,
              }
            : cat,
        ),
      );
      setEditingCat(null);
      setShowAddCatForm(false);
    }
  };

  const handleDeleteCat = (catId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setCats((prev) => prev.filter((cat) => cat.id !== catId));
    }
  };

  // Handle device functions
  const handleAddDevice = (
    deviceData: Omit<Device, "id" | "lastConnected">,
  ) => {
    const newDevice: Device = {
      ...deviceData,
      id: Math.max(...devices.map((d) => d.id)) + 1,
      lastConnected: new Date().toISOString(),
    };
    setDevices((prev) => [newDevice, ...prev]);
    setShowAddDeviceForm(false);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setShowAddDeviceForm(true);
  };

  const handleUpdateDevice = (
    deviceData: Omit<Device, "id" | "lastConnected">,
  ) => {
    if (editingDevice) {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === editingDevice.id
            ? {
                ...deviceData,
                id: editingDevice.id,
                lastConnected: editingDevice.lastConnected,
              }
            : device,
        ),
      );
      setEditingDevice(null);
      setShowAddDeviceForm(false);
    }
  };

  const handleDeleteDevice = (deviceId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setDevices((prev) =>
        prev.filter((device) => device.id !== deviceId),
      );
    }
  };

  // Handle click functions
  const handleItemClick = (item: any) => {
    if (currentBoard === "info") {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, views: p.views + 1 } : p,
        ),
      );
      setSelectedPost(item);
    } else if (currentBoard === "qna") {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, views: q.views + 1 } : q,
        ),
      );
      setSelectedQuestion(item);
    } else if (currentBoard === "notice") {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, views: n.views + 1 } : n,
        ),
      );
      setSelectedNotice(item);
    }
  };

  // Handle edit click functions
  const handleEditClick = (item: any) => {
    if (currentBoard === "info") {
      setEditingPost(item);
      setShowCreateForm(true);
    } else if (currentBoard === "qna") {
      setEditingQuestion(item);
      setShowCreateForm(true);
    } else if (currentBoard === "notice") {
      setEditingNotice(item);
      setShowCreateForm(true);
    }
  };

  // Reset filters when changing boards
  const handleBoardChange = (board: BoardType) => {
    setCurrentBoard(board);
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchTerm("");
    setSortBy("latest");
    if (
      board === "notice" ||
      board === "qna" ||
      board === "info"
    ) {
      setViewMode("table");
    } else {
      setViewMode("card");
    }
  };

  // Handle menu change
  const handleMenuChange = (menu: MenuType) => {
    setCurrentMenu(menu);
    if (menu === "board") {
      // Keep current board when switching back to board menu
    } else if (menu === "management") {
      // Keep current management when switching back to management menu
    } else {
      // Reset board-specific states when switching to other menus
      setSelectedCategory(null);
      setSelectedStatus(null);
      setSearchTerm("");
      setSortBy("latest");
    }
  };

  // Handle management change
  const handleManagementChange = (
    management: ManagementType,
  ) => {
    setCurrentManagement(management);
    setCurrentMenu("management");
  };

  // Show authentication pages - moved after all hooks
  if (!isAuthenticated) {
    if (authPage === "login") {
      return (
        <LoginPage
          onLogin={handleLoginAttempt}
          onGoToSignup={() => setAuthPage("signup")}
        />
      );
    } else {
      return (
        <SignupPage
          onSignup={handleSignupAttempt}
          onGoToLogin={() => setAuthPage("login")}
        />
      );
    }
  }

  // Show detail views
  if (selectedPost) {
    const updatedPost =
      posts.find((p) => p.id === selectedPost.id) ||
      selectedPost;
    return (
      <PostDetail
        post={updatedPost}
        onBack={() => setSelectedPost(null)}
        canEdit={canEditItem(currentUser, updatedPost.author)}
        canDelete={canDeleteItem(
          currentUser,
          updatedPost.author,
        )}
        onEdit={() => handleEditClick(updatedPost)}
        onDelete={() => handleDeletePost(updatedPost.id)}
      />
    );
  }

  if (selectedQuestion) {
    const updatedQuestion =
      questions.find((q) => q.id === selectedQuestion.id) ||
      selectedQuestion;
    return (
      <QuestionDetail
        question={updatedQuestion}
        onBack={() => setSelectedQuestion(null)}
        canEdit={canEditItem(
          currentUser,
          updatedQuestion.author,
        )}
        canDelete={canDeleteItem(
          currentUser,
          updatedQuestion.author,
        )}
        onEdit={() => handleEditClick(updatedQuestion)}
        onDelete={() =>
          handleDeleteQuestion(updatedQuestion.id)
        }
      />
    );
  }

  if (selectedNotice) {
    const updatedNotice =
      notices.find((n) => n.id === selectedNotice.id) ||
      selectedNotice;
    return (
      <NoticeDetail
        notice={updatedNotice}
        onBack={() => setSelectedNotice(null)}
        canEdit={canEditItem(currentUser, updatedNotice.author)}
        canDelete={canDeleteItem(
          currentUser,
          updatedNotice.author,
        )}
        onEdit={() => handleEditClick(updatedNotice)}
        onDelete={() => handleDeleteNotice(updatedNotice.id)}
      />
    );
  }

  const renderContent = () => {
    if (currentMenu === "dashboard") {
      return (
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Half - Dashboard Notices */}
            <div>
              <DashboardNotices />
            </div>

            {/* Right Half - Cat Feeding Stats */}
            <div>
              <CatFeedingStats
                cats={cats}
                onGoToCatManagement={() => {
                  handleMenuChange("management");
                  setCurrentManagement("cats");
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (currentMenu === "management") {
      if (currentManagement === "cats") {
        return (
          <CatManagement
            cats={cats}
            onAddCat={() => setShowAddCatForm(true)}
            onEditCat={handleEditCat}
            onDeleteCat={handleDeleteCat}
          />
        );
      } else if (currentManagement === "devices") {
        return (
          <DeviceManagement
            devices={devices}
            onAddDevice={() => setShowAddDeviceForm(true)}
            onEditDevice={handleEditDevice}
            onDeleteDevice={handleDeleteDevice}
          />
        );
      }
    }

    if (currentMenu === "home-cam") {
      return <HomeCam />;
    }

    if (currentMenu === "schedule") {
      return <Schedule />;
    }

    if (currentMenu === "statistics") {
      return <Statistics cats={cats} />;
    }

    if (currentMenu === "my-page") {
      return <MyPage user={currentUser!} />;
    }

    if (currentMenu === "admin") {
      if (currentUser?.role !== "admin") {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                관리자 권한이 필요합니다.
              </div>
            </div>
          </div>
        );
      }
      return <AdminPage />;
    }

    if (currentMenu !== "board") {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">
              페이지 준비중입니다.
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Main Header */}
        <MainHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          postsCount={filteredData.length}
          selectedCategory={
            currentBoard === "qna"
              ? selectedStatus
              : selectedCategory
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Category/Status Tabs with Create Button */}
        {currentBoard === "qna" ? (
          <StatusTabs
            selectedStatus={selectedStatus}
            onStatusSelect={setSelectedStatus}
            questionCounts={counts}
            onCreateClick={() => setShowCreateForm(true)}
            createButtonText={getCreateButtonText(currentBoard)}
          />
        ) : currentBoard === "notice" ? (
          <CategoryTabs
            categories={currentCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            postCounts={counts}
            onCreateClick={
              canCreateNotice(currentUser)
                ? () => setShowCreateForm(true)
                : undefined
            }
            createButtonText={getCreateButtonText(currentBoard)}
          />
        ) : (
          <CategoryTabs
            categories={currentCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            postCounts={counts}
            onCreateClick={() => setShowCreateForm(true)}
            createButtonText={getCreateButtonText(currentBoard)}
          />
        )}

        {/* Content with Inline Search */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white border-b border-border">
            {filteredData.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-muted-foreground mb-4">
                    {searchTerm ||
                    selectedCategory ||
                    selectedStatus
                      ? "검색 결과가 없습니다."
                      : `${getBoardTitle(currentBoard)}에 게시물이 없습니다.`}
                  </div>
                  {(currentBoard !== "notice" ||
                    (currentBoard === "notice" &&
                      canCreateNotice(currentUser))) && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="text-primary hover:underline"
                    >
                      첫 번째 게시물을 작성해보세요
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                {viewMode === "card" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredData.map((item) => {
                      if (currentBoard === "info") {
                        return (
                          <PostCard
                            key={item.id}
                            post={item as Post}
                            onClick={() =>
                              handleItemClick(item)
                            }
                            canEdit={canEditItem(
                              currentUser,
                              item.author,
                            )}
                            canDelete={canDeleteItem(
                              currentUser,
                              item.author,
                            )}
                            onEdit={() => handleEditClick(item)}
                            onDelete={() =>
                              handleDeletePost(item.id)
                            }
                          />
                        );
                      } else if (currentBoard === "qna") {
                        return (
                          <QuestionCard
                            key={item.id}
                            question={item as Question}
                            onClick={() =>
                              handleItemClick(item)
                            }
                            canEdit={canEditItem(
                              currentUser,
                              item.author,
                            )}
                            canDelete={canDeleteItem(
                              currentUser,
                              item.author,
                            )}
                            onEdit={() => handleEditClick(item)}
                            onDelete={() =>
                              handleDeleteQuestion(item.id)
                            }
                          />
                        );
                      } else {
                        return (
                          <NoticeCard
                            key={item.id}
                            notice={item as Notice}
                            onClick={() =>
                              handleItemClick(item)
                            }
                            canEdit={canEditItem(
                              currentUser,
                              item.author,
                            )}
                            canDelete={canDeleteItem(
                              currentUser,
                              item.author,
                            )}
                            onEdit={() => handleEditClick(item)}
                            onDelete={() =>
                              handleDeleteNotice(item.id)
                            }
                          />
                        );
                      }
                    })}
                  </div>
                ) : (
                  <>
                    {currentBoard === "info" && (
                      <PostTable
                        posts={filteredData as Post[]}
                        onPostClick={handleItemClick}
                        currentUser={currentUser}
                        onEdit={handleEditClick}
                        onDelete={handleDeletePost}
                      />
                    )}
                    {currentBoard === "qna" && (
                      <QuestionTable
                        questions={filteredData as Question[]}
                        onQuestionClick={handleItemClick}
                        currentUser={currentUser}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteQuestion}
                      />
                    )}
                    {currentBoard === "notice" && (
                      <NoticeTable
                        notices={filteredData as Notice[]}
                        onNoticeClick={handleItemClick}
                        currentUser={currentUser}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteNotice}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Inline Search at bottom of content box */}
            <InlineSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              resultsCount={filteredData.length}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
        {/* Header with User Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-primary">캣밥바라기</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <ImageWithFallback
                src={
                  currentUser?.profileImage ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                }
                alt="사용자 프로필"
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser?.email}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            고양이 집사들의 공간
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => handleMenuChange("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                currentMenu === "dashboard"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>대시보드</span>
            </button>

            {/* 관리 Menu with Submenu */}
            <div>
              <button
                onClick={() => {
                  setIsManagementMenuOpen(
                    !isManagementMenuOpen,
                  );
                  if (!isManagementMenuOpen) {
                    handleMenuChange("management");
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  currentMenu === "management"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>관리</span>
                </span>
                {isManagementMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Management Submenu */}
              {isManagementMenuOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() =>
                      handleManagementChange("cats")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentMenu === "management" &&
                      currentManagement === "cats"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4" />
                      <span>고양이</span>
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      handleManagementChange("devices")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentMenu === "management" &&
                      currentManagement === "devices"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4" />
                      <span>장치</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Board Menu with Submenu */}
            <div>
              <button
                onClick={() => {
                  setIsBoardMenuOpen(!isBoardMenuOpen);
                  if (!isBoardMenuOpen) {
                    handleMenuChange("board");
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  currentMenu === "board"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>게시판</span>
                </span>
                {isBoardMenuOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Submenu */}
              {isBoardMenuOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      handleMenuChange("board");
                      handleBoardChange("info");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentMenu === "board" &&
                      currentBoard === "info"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    정보게시판
                  </button>
                  <button
                    onClick={() => {
                      handleMenuChange("board");
                      handleBoardChange("qna");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentMenu === "board" &&
                      currentBoard === "qna"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    Q&A
                  </button>
                  <button
                    onClick={() => {
                      handleMenuChange("board");
                      handleBoardChange("notice");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      currentMenu === "board" &&
                      currentBoard === "notice"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    공지사항
                  </button>
                </div>
              )}
            </div>

            {/* 홈캠 */}
            <button
              onClick={() => handleMenuChange("home-cam")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                currentMenu === "home-cam"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-foreground"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>홈캠</span>
            </button>

            {/* 일정 */}
            <button
              onClick={() => handleMenuChange("schedule")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                currentMenu === "schedule"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-foreground"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>일정</span>
            </button>

            {/* 통계조회 */}
            <button
              onClick={() => handleMenuChange("statistics")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                currentMenu === "statistics"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>통계조회</span>
            </button>

            {/* 마이페이지 */}
            <button
              onClick={() => handleMenuChange("my-page")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                currentMenu === "my-page"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              <span>마이페이지</span>
            </button>

            {/* 관리자 페이지 - 관리자만 표시 */}
            {currentUser?.role === "admin" && (
              <button
                onClick={() => handleMenuChange("admin")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  currentMenu === "admin"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>관리자</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>

      {/* Create/Edit Forms - Only show when in board menu */}
      {currentMenu === "board" &&
        showCreateForm &&
        currentBoard === "info" && (
          <CreatePostForm
            onClose={() => {
              setShowCreateForm(false);
              setEditingPost(null);
            }}
            onSubmit={
              editingPost ? handleEditPost : handleCreatePost
            }
            editingPost={editingPost}
          />
        )}
      {currentMenu === "board" &&
        showCreateForm &&
        currentBoard === "qna" && (
          <CreateQuestionForm
            onClose={() => {
              setShowCreateForm(false);
              setEditingQuestion(null);
            }}
            onSubmit={
              editingQuestion
                ? handleEditQuestion
                : handleCreateQuestion
            }
            editingQuestion={editingQuestion}
          />
        )}
      {currentMenu === "board" &&
        showCreateForm &&
        currentBoard === "notice" &&
        canCreateNotice(currentUser) && (
          <CreateNoticeForm
            onClose={() => {
              setShowCreateForm(false);
              setEditingNotice(null);
            }}
            onSubmit={
              editingNotice
                ? handleEditNotice
                : handleCreateNotice
            }
            editingNotice={editingNotice}
          />
        )}

      {/* Cat Add/Edit Form */}
      {showAddCatForm && (
        <AddCatForm
          onClose={() => {
            setShowAddCatForm(false);
            setEditingCat(null);
          }}
          onSubmit={editingCat ? handleUpdateCat : handleAddCat}
          editingCat={editingCat}
        />
      )}

      {/* Device Add/Edit Form */}
      {showAddDeviceForm && (
        <AddDeviceForm
          onClose={() => {
            setShowAddDeviceForm(false);
            setEditingDevice(null);
          }}
          onSubmit={
            editingDevice ? handleUpdateDevice : handleAddDevice
          }
          editingDevice={editingDevice}
        />
      )}
    </div>
  );
}