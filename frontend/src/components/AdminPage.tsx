import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Camera, 
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Shield,
  Database,
  Server,
  Trash2,
  Edit,
  Eye,
  Brain,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  FileText
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface User {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  catsCount: number;
  postsCount: number;
  lastLogin: string;
}

interface SystemStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface AIModel {
  id: number;
  userId: number;
  userName: string;
  modelType: 'YOLO' | 'Custom';
  version: string;
  status: 'running' | 'stopped' | 'error' | 'updating';
  lastUpdated: string;
  accuracy: number;
  errors: string[];
  systemInfo: {
    cpu: string;
    memory: string;
    storage: string;
  };
}

const mockAIModels: AIModel[] = [
  {
    id: 1,
    userId: 1,
    userName: "김집사",
    modelType: "YOLO",
    version: "v8.2.0",
    status: "running",
    lastUpdated: "2025-01-24T08:30:00Z",
    accuracy: 94.2,
    errors: [],
    systemInfo: {
      cpu: "Intel i7-12700K",
      memory: "16GB DDR4",
      storage: "1TB SSD"
    }
  },
  {
    id: 2,
    userId: 2,
    userName: "이냥이",
    modelType: "YOLO",
    version: "v8.1.5",
    status: "error",
    lastUpdated: "2025-01-23T14:20:00Z",
    accuracy: 87.1,
    errors: [
      "CUDA out of memory error at 14:20",
      "Model loading failed - insufficient GPU memory",
      "Connection timeout to inference server"
    ],
    systemInfo: {
      cpu: "AMD Ryzen 7 5700X",
      memory: "8GB DDR4",
      storage: "512GB NVMe"
    }
  },
  {
    id: 3,
    userId: 3,
    userName: "박집사",
    modelType: "Custom",
    version: "v1.2.3",
    status: "stopped",
    lastUpdated: "2025-01-20T11:45:00Z",
    accuracy: 91.8,
    errors: [
      "Manual stop requested by user"
    ],
    systemInfo: {
      cpu: "Intel i5-11400F",
      memory: "32GB DDR4",
      storage: "2TB HDD"
    }
  },
  {
    id: 4,
    userId: 4,
    userName: "최냥집사",
    modelType: "YOLO",
    version: "v8.2.0",
    status: "updating",
    lastUpdated: "2025-01-24T10:15:00Z",
    accuracy: 92.5,
    errors: [],
    systemInfo: {
      cpu: "Apple M2 Pro",
      memory: "16GB Unified",
      storage: "1TB SSD"
    }
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    username: "김집사",
    email: "catowner@gmail.com",
    joinDate: "2024-06-15T00:00:00Z",
    status: "active",
    catsCount: 4,
    postsCount: 12,
    lastLogin: "2025-01-24T10:30:00Z"
  },
  {
    id: 2,
    username: "이냥이",
    email: "cat.lover@gmail.com",
    joinDate: "2024-08-20T00:00:00Z",
    status: "active",
    catsCount: 2,
    postsCount: 8,
    lastLogin: "2025-01-23T16:45:00Z"
  },
  {
    id: 3,
    username: "박집사",
    email: "meow.master@naver.com",
    joinDate: "2024-10-05T00:00:00Z",
    status: "inactive",
    catsCount: 1,
    postsCount: 3,
    lastLogin: "2025-01-15T09:20:00Z"
  },
];

export function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [aiModels, setAiModels] = useState<AIModel[]>(mockAIModels);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'system' | 'ai-models'>('overview');

  const systemStats: SystemStat[] = [
    {
      title: "총 사용자",
      value: users.length.toString(),
      change: "+12%",
      trend: "up",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "활성 사용자",
      value: users.filter(u => u.status === 'active').length.toString(),
      change: "+8%",
      trend: "up",
      icon: <Activity className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "총 게시물",
      value: users.reduce((sum, u) => sum + u.postsCount, 0).toString(),
      change: "+23%",
      trend: "up",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "등록된 고양이",
      value: users.reduce((sum, u) => sum + u.catsCount, 0).toString(),
      change: "+15%",
      trend: "up",
      icon: <Heart className="w-5 h-5" />,
      color: "text-pink-600"
    }
  ];

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return '활성';
      case 'inactive': return '비활성';
      case 'suspended': return '정지';
      default: return '알 수 없음';
    }
  };

  const getTrendIcon = (trend: SystemStat['trend']) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUserAction = (userId: number, action: 'view' | 'edit' | 'suspend' | 'activate' | 'delete') => {
    switch (action) {
      case 'suspend':
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'suspended' } : user
        ));
        break;
      case 'activate':
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        ));
        break;
      case 'delete':
        if (confirm('정말 이 사용자를 삭제하시겠습니까?')) {
          setUsers(prev => prev.filter(user => user.id !== userId));
        }
        break;
      default:
        alert(`${action} 기능은 준비 중입니다.`);
    }
  };

  const getAIStatusColor = (status: AIModel['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'stopped': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'updating': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAIStatusText = (status: AIModel['status']) => {
    switch (status) {
      case 'running': return '실행 중';
      case 'stopped': return '정지';
      case 'error': return '오류';
      case 'updating': return '업데이트 중';
      default: return '알 수 없음';
    }
  };

  const getStatusIcon = (status: AIModel['status']) => {
    switch (status) {
      case 'running': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'stopped': return <WifiOff className="w-4 h-4 text-gray-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'updating': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <HardDrive className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleModelAction = (modelId: number, action: 'start' | 'stop' | 'restart' | 'update' | 'delete') => {
    switch (action) {
      case 'start':
        setAiModels(prev => prev.map(model => 
          model.id === modelId ? { ...model, status: 'running' } : model
        ));
        break;
      case 'stop':
        setAiModels(prev => prev.map(model => 
          model.id === modelId ? { ...model, status: 'stopped' } : model
        ));
        break;
      case 'restart':
        setAiModels(prev => prev.map(model => 
          model.id === modelId ? { ...model, status: 'updating' } : model
        ));
        // Simulate restart completion
        setTimeout(() => {
          setAiModels(prev => prev.map(model => 
            model.id === modelId ? { ...model, status: 'running' } : model
          ));
        }, 3000);
        break;
      case 'update':
        setAiModels(prev => prev.map(model => 
          model.id === modelId ? { ...model, status: 'updating' } : model
        ));
        break;
      case 'delete':
        if (confirm('정말 이 AI 모델을 삭제하시겠습니까?')) {
          setAiModels(prev => prev.filter(model => model.id !== modelId));
        }
        break;
      default:
        alert(`${action} 기능은 준비 중입니다.`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-2 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            관리자 대시보드
          </h1>
          <p className="text-muted-foreground">시스템 관리 및 사용자 현황을 확인하세요.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          관리자 전용
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'overview' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          개요
        </button>
        <button
          onClick={() => setSelectedTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'users' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          사용자 관리
        </button>
        <button
          onClick={() => setSelectedTab('system')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'system' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          시스템 현황
        </button>
        <button
          onClick={() => setSelectedTab('ai-models')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'ai-models' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          AI 모델 관리
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getTrendIcon(stat.trend)} {stat.change}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-medium">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  최근 가입 사용자
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {users
                  .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                  .slice(0, 5)
                  .map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <Avatar className="w-8 h-8">
                        <ImageWithFallback
                          src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="text-xs">
                          {user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(user.joinDate).split(' ')[0]}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  시스템 알림
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">서버 용량 주의</div>
                    <div className="text-xs text-muted-foreground">디스크 사용량이 80%를 초과했습니다.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">데이터베이스 백업 완료</div>
                    <div className="text-xs text-muted-foreground">오늘 새벽 3시에 자동 백업이 완료되었습���다.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">시스템 업데이트 완료</div>
                    <div className="text-xs text-muted-foreground">보안 패치가 성공적으로 적용되었습니다.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              사용자 관리
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              총 {users.length}명의 사용자가 등록되어 있습니다.
            </p>
          </CardHeader>
          <CardContent>
            {/* 👇 가로 스크롤을 위한 div 추가 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {/* 👇 각 th에 text-left, py-3, px-4, whitespace-nowrap 클래스 적용 */}
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">사용자</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">연락처</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">가입일</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">상태</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">활동</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">최근 로그인</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-gray-50">
                      {/* 👇 각 td에 py-3, px-4, whitespace-nowrap 및 최소 너비(min-w) 적용 */}
                      <td className="py-3 px-4 whitespace-nowrap min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <ImageWithFallback
                              src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                            <AvatarFallback className="text-xs">
                              {user.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{user.email}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatDate(user.joinDate).split(' ')[0]}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(user.status)}`}>
                          {getStatusText(user.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap min-w-[120px]">
                        <div className="space-y-1">
                          <div>고양이: {user.catsCount}마리</div>
                          <div>게시물: {user.postsCount}개</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap min-w-[160px]">{formatDate(user.lastLogin)}</td>
                      <td className="py-3 px-4 whitespace-nowrap min-w-[200px]">
                         <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              정지
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="text-green-600 hover:text-green-700"
                            >
                              활성
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Tab */}
      {selectedTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                서버 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU 사용률</span>
                  <span className="text-sm font-medium text-green-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">메모리 사용률</span>
                  <span className="text-sm font-medium text-yellow-600">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">디스크 사용률</span>
                  <span className="text-sm font-medium text-red-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">운영 시간</span>
                    <span>24일 12시간</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">마지막 재시작</span>
                    <span>2025-01-01 03:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                시스템 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                데이터베이스 백업
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                시스템 설정 관리
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                로그 분석
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                보안 설정
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                시스템 재시작
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Models Tab */}
      {selectedTab === 'ai-models' && (
        <div className="space-y-6">
          {/* AI Models Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">총 모델</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-medium">{aiModels.length}</h3>
                  <p className="text-sm text-muted-foreground">등록된 AI 모델</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">실행 중</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-medium">{aiModels.filter(m => m.status === 'running').length}</h3>
                  <p className="text-sm text-muted-foreground">활성 모델</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">오류 발생</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-medium">{aiModels.filter(m => m.status === 'error').length}</h3>
                  <p className="text-sm text-muted-foreground">오류 모델</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">평균 정확도</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-medium">
                    {Math.round(aiModels.reduce((sum, m) => sum + m.accuracy, 0) / aiModels.length)}%
                  </h3>
                  <p className="text-sm text-muted-foreground">모델 정확도</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Models Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI 모델 관리
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                사용자별 AI 모델 상태 및 성능을 관리합니다.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <Brain className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{model.userName}의 {model.modelType} 모델</h3>
                          <p className="text-sm text-muted-foreground">버전: {model.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getAIStatusColor(model.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(model.status)}
                            {getAIStatusText(model.status)}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          버전 정보
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">버전:</span>
                            <span className="font-medium">{model.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">마지막 업데이트:</span>
                            <span>{formatDate(model.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          성능 정보
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">정확도:</span>
                            <span className="font-medium">{model.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">모델 타입:</span>
                            <span>{model.modelType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          에러 로그
                          {model.errors.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {model.errors.length}
                            </Badge>
                          )}
                        </h4>
                        <div className="max-h-16 overflow-y-auto">
                          {model.errors.length > 0 ? (
                            <div className="space-y-1">
                              {model.errors.map((error, index) => (
                                <div key={index} className="text-xs text-red-600 bg-red-50 p-1 rounded">
                                  {error}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">에러 없음</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                      {model.status === 'stopped' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleModelAction(model.id, 'start')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Wifi className="w-4 h-4 mr-1" />
                          시작
                        </Button>
                      )}
                      {model.status === 'running' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleModelAction(model.id, 'stop')}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <WifiOff className="w-4 h-4 mr-1" />
                          정지
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleModelAction(model.id, 'restart')}
                        disabled={model.status === 'updating'}
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${model.status === 'updating' ? 'animate-spin' : ''}`} />
                        재시작
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleModelAction(model.id, 'update')}
                        disabled={model.status === 'updating'}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        업데이트
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleModelAction(model.id, 'delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}