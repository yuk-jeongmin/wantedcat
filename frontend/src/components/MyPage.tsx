import { useState, useRef, ChangeEvent,useEffect} from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Bell, 
  Shield, 
  Key, 
  CreditCard,
  Settings,
  Plus,
  Wifi,
  WifiOff,
  Activity,
  Scale
} from "lucide-react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";


interface Device {
  id: number;
  name: string;
  type: 'homecam' | 'weight-sensor';
  status: 'online' | 'offline' | 'error';
  location: string;
  lastUpdate: string;
  batteryLevel?: number;
}

interface Cat {
  id: number;
  name: string;
  // Add other cat properties as needed
}

interface MyPageProps {
  user: {
    username?: string;
    email?: string;
    profileImage?: string;
    joinDate?: string;
  };
  onUserUpdate: (updatedUser: MyPageProps['user']) => void;
}


const mockDevices: Device[] = [
  {
    id: 1,
    name: "거실 홈캠",
    type: "homecam",
    status: "online",
    location: "거실",
    lastUpdate: "2025-01-24T15:30:00Z"
  },
  {
    id: 2,
    name: "식사 공간 무게센서",
    type: "weight-sensor",
    status: "online",
    location: "주방",
    lastUpdate: "2025-01-24T15:25:00Z",
    batteryLevel: 85
  },
  {
    id: 3,
    name: "침실 홈캠",
    type: "homecam",
    status: "offline",
    location: "침실",
    lastUpdate: "2025-01-23T22:15:00Z"
  }
];

export function MyPage({ user, onUserUpdate }: MyPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'notifications' | 'security'>('profile');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

    useEffect(() => {
    async function fetchData() {
      try {
        // Cats
        const catResponse = await axios.get("/api/cats", {
          withCredentials: true,
        });
        setCats(catResponse.data);

        // Devices
        const devicesResponse = await axios.get("/api/devices", {
          withCredentials: true,
        });
        setDevices(devicesResponse.data);

      } catch (error) {
        console.error("데이터 가져오기 실패", error);
      }
    }
    fetchData();
  },[]);
  


  const [notifications, setNotifications] = useState({
    feedingAlerts: true,
    healthAlerts: true,
    deviceAlerts: true,
    communityUpdates: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getDeviceIcon = (type: Device['type']) => {
    return type === 'homecam' ? <Camera className="w-4 h-4" /> : <Scale className="w-4 h-4" />;
  };

  const getDeviceTypeName = (type: Device['type']) => {
    return type === 'homecam' ? '홈캠' : '무게센서';
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };


  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return `${Math.floor(diffMinutes / 1440)}일 전`;
  };

  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
        const updateRequest = {
            username: localUser.username ?? "",
            email: localUser.email,
            profileImage: previewUrl || localUser.profileImage, // 이전에 선택한 파일이 없으면 기존 이미지 사용
        };
        const response = await axios.put("/api/user/update", updateRequest, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        alert("수정완료!");
        onUserUpdate(response.data); // App.tsx의 currentUser 상태 업데이트
    } catch (error) {
        console.error("update failed", error);
        alert("업데이트 실패");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await axios.put("/api/user/change-password", {
        currentPassword,
        newPassword,
      }, { withCredentials: true });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("password change failed", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  const handleAddDevice = (deviceType: 'homecam' | 'weight-sensor') => {
    const newDevice: Device = {
      id: Math.max(...devices.map(d => d.id)) + 1,
      name: `새 ${getDeviceTypeName(deviceType)}`,
      type: deviceType,
      status: 'offline',
      location: '설정 필요',
      lastUpdate: new Date().toISOString(),
      ...(deviceType === 'weight-sensor' && { batteryLevel: 100 })
    };
    
    setDevices(prev => [...prev, newDevice]);
    setShowAddDevice(false);
  };

  const handleRemoveDevice = (deviceId: number) => {
    if (confirm('정말 이 장치를 제거하시겠습니까?')) {
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium mb-2">마이페이지</h1>
        <p className="text-muted-foreground">개인정보와 설정을 관리하세요.</p>
      </div>

      {/* Tab Navigation */}
      <div >
      <button
        onClick={() => setActiveTab('profile')}
        className={`bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300 ${
          activeTab === 'profile' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        개인정보
      </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {/* <ImageWithFallback
                      src={previewUrl || userInfo.profileImage }
                      alt="프로필 사진"
                      className="w-full h-full object-cover"
                    /> */}
                    <img
                        src={previewUrl || localUser.profileImage}
                        alt="프로필 사진"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-profile.png"; // 에러 시 기본 이미지 사용
                        }}
                      />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/png, image/jpeg"
                    />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="w-4 h-4 mr-2" />
                      사진 변경
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG 파일을 업로드하세요
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={localUser.username}
                      onChange={(e) => setLocalUser(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={localUser.email}
                      onChange={(e) => setLocalUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">가입일</Label>
                    <Input
                      id="joinDate"
                      value={new Date(localUser.joinDate).toLocaleDateString('ko-KR')}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>    
                <div className="flex space-x-6">
                    <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                        변경사항 저장
                    </Button>
                    <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                        <Key className="w-4 h-4 mr-2" />
                        비밀번호 변경
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">계정 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">등록된 고양이</span>
                  <span className="text-sm font-medium">{cats.length}마리</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">연결된 장치</span>
                  <span className="text-sm font-medium">{devices.length}개</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">연결된 장치</h3>
              <p className="text-sm text-muted-foreground">총 {devices.length}개의 장치가 연결되어 있습니다</p>
            </div>
            <Button onClick={() => setShowAddDevice(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              장치 추가
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <div>
                        <h4 className="font-medium text-sm">{device.name}</h4>
                        <p className="text-xs text-muted-foreground">{getDeviceTypeName(device.type)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">위치:</span>
                      <span>{device.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">마지막 업데이트:</span>
                      <span>{formatLastUpdate(device.lastUpdate)}</span>
                    </div>
                    {device.batteryLevel && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">배터리:</span>
                        <span className={device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}>
                          {device.batteryLevel}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-3 h-3 mr-1" />
                      설정
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRemoveDevice(device.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      제거
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">식사 알림</h4>
                  <p className="text-sm text-muted-foreground">고양이의 식사 시간과 양에 대한 알림</p>
                </div>
                <Switch
                  checked={notifications.feedingAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, feedingAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">건강 알림</h4>
                  <p className="text-sm text-muted-foreground">건강 상태 변화와 병원 예약 알림</p>
                </div>
                <Switch
                  checked={notifications.healthAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, healthAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">장치 알림</h4>
                  <p className="text-sm text-muted-foreground">홈캠, 센서 등 장치 상태 알림</p>
                </div>
                <Switch
                  checked={notifications.deviceAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, deviceAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">커뮤니티 알림</h4>
                  <p className="text-sm text-muted-foreground">새 게시물과 댓글 알림</p>
                </div>
                <Switch
                  checked={notifications.communityUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, communityUpdates: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">이메일 알림</h4>
                  <p className="text-sm text-muted-foreground">이메일로 알림 받기</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">푸시 알림</h4>
                  <p className="text-sm text-muted-foreground">모바일 푸시 알림 받기</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                계정 보안
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                비밀번호 변경
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                2단계 인증 설정
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                로그인 기록 확인
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개인정보 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                개인정보 내보내기
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                계정 삭제
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>장치 추가</CardTitle>
              <p className="text-sm text-muted-foreground">
                추가할 장치 유형을 선택하세요
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddDevice('homecam')}
                  className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">홈캠</div>
                  <div className="text-xs text-muted-foreground">실시간 모니터링</div>
                </button>
                
                <button
                  onClick={() => handleAddDevice('weight-sensor')}
                  className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Scale className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">무게센서</div>
                  <div className="text-xs text-muted-foreground">식사량 측정</div>
                </button>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowAddDevice(false)}
                className="w-full"
              >
                취소
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                  취소
                </Button>
                <Button onClick={handlePasswordChange}>
                  변경사항 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
