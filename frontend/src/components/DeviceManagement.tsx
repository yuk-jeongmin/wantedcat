import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Plus,
  Wifi,
  WifiOff,
  AlertTriangle,
  Camera,
  Coffee,
  Droplets,
  MapPin,
  Activity,
  Battery,
  MoreVertical,
  Trash2,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { Device } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DeviceManagementProps {
  devices: Device[];
  onAddDevice: () => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: number) => void;
}

const deviceTypeIcons = {
  camera: Camera,
  feeder: Coffee,
  'water-dispenser': Droplets,
  tracker: MapPin,
  sensor: Activity
};

const deviceTypeNames = {
  camera: "카메라",
  feeder: "급식기",
  'water-dispenser': "물통",
  tracker: "GPS 트래커",
  sensor: "센서"
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400", 
  error: "bg-red-500"
};

const statusLabels = {
  online: "온라인",
  offline: "오프라인",
  error: "오류"
};

export function DeviceManagement({ devices, onAddDevice, onEditDevice, onDeleteDevice }: DeviceManagementProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const formatLastConnected = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return `${diffDays}일 전`;
    }
  };
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-primary mb-2">장치 관리</h1>
          <p className="text-muted-foreground">등록된 IoT 장치들을 관리하세요</p>
        </div>
        <Button onClick={onAddDevice} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          장치 추가
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Wifi className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">전체 장치</p>
                <p className="text-2xl text-primary">{devices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Grid */}
      {devices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg mb-2">등록된 장치가 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              첫 번째 IoT 장치를 등록해보세요
            </p>
            <Button onClick={onAddDevice} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              장치 추가
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const IconComponent = deviceTypeIcons[device.type];
            return (
              <Card key={device.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{device.devicename}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {deviceTypeNames[device.type]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditDevice(device)}>
                            <Settings className="w-4 h-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteDevice(device.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">                  
                    {device.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">위치</span>
                        <span className="text-sm">{device.location}</span>
                      </div>
                    )}

                    {device.wifiName && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">WiFi</span>
                        <span className="text-sm">{device.wifiName}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}