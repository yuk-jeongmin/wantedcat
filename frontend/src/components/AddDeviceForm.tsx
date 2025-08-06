import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Wifi, 
  Bluetooth, 
  Search, 
  Loader2,
  Camera,
  Coffee,
  Droplets,
  MapPin,
  Activity,
  CheckCircle
} from "lucide-react";
import type { Device, BluetoothDevice } from "../types";

interface AddDeviceFormProps {
  onClose: () => void;
  onSubmit: (deviceData: Omit<Device, 'id' | 'lastConnected'>) => void;
  editingDevice?: Device | null;
}

const deviceTypes = [
  { value: 'camera', label: '카메라', icon: Camera },
  { value: 'feeder', label: '급식기', icon: Coffee },
  { value: 'water-dispenser', label: '물통', icon: Droplets },
  { value: 'tracker', label: 'GPS 트래커', icon: MapPin },
  { value: 'sensor', label: '센서', icon: Activity },
];

// Mock Bluetooth devices for demo
const mockBluetoothDevices: BluetoothDevice[] = [
  { id: 'bt-001', name: 'CatCam Pro', rssi: -45, type: 'camera', connected: false },
  { id: 'bt-002', name: 'SmartFeeder V2', rssi: -52, type: 'feeder', connected: false },
  { id: 'bt-003', name: 'AquaSensor', rssi: -38, type: 'water-dispenser', connected: false },
  { id: 'bt-004', name: 'PetTracker Mini', rssi: -67, type: 'tracker', connected: false },
  { id: 'bt-005', name: 'HomeSensor', rssi: -71, type: 'sensor', connected: false },
  { id: 'bt-006', name: 'Unknown Device', rssi: -89, type: 'unknown', connected: false },
];

export function AddDeviceForm({ onClose, onSubmit, editingDevice }: AddDeviceFormProps) {
  const [formData, setFormData] = useState({
    name: editingDevice?.name || '',
    type: editingDevice?.type || 'camera',
    wifiName: editingDevice?.wifiName || '',
    wifiPassword: '',
    location: editingDevice?.location || '',
    macAddress: editingDevice?.macAddress || ''
  });

  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [selectedBluetoothDevice, setSelectedBluetoothDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startBluetoothScan = async () => {
    setIsScanning(true);
    setScanCompleted(false);
    setBluetoothDevices([]);
    
    // Simulate scanning process
    setTimeout(() => {
      setBluetoothDevices(mockBluetoothDevices);
      setIsScanning(false);
      setScanCompleted(true);
    }, 3000);
  };

  const connectToBluetoothDevice = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    setSelectedBluetoothDevice(device);
    
    // Simulate connection process
    setTimeout(() => {
      setBluetoothDevices(prev => 
        prev.map(d => 
          d.id === device.id 
            ? { ...d, connected: true }
            : { ...d, connected: false }
        )
      );
      
      // Auto-fill form data based on selected device
      if (device.name !== 'Unknown Device') {
        const deviceType = deviceTypes.find(t => device.type.includes(t.value))?.value || 'camera';
        setFormData(prev => ({
          ...prev,
          name: device.name,
          type: deviceType as any,
          macAddress: `${device.id.toUpperCase()}:${Math.random().toString(16).substr(2, 8).toUpperCase()}`
        }));
      }
      
      setIsConnecting(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deviceData: Omit<Device, 'id' | 'lastConnected'> = {
      name: formData.name,
      type: formData.type as Device['type'],
      status: 'online',
      macAddress: formData.macAddress || `AA:BB:CC:DD:EE:${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
      wifiName: formData.wifiName || undefined,
      location: formData.location || undefined,
      batteryLevel: ['tracker', 'sensor'].includes(formData.type) ? Math.floor(Math.random() * 40) + 60 : undefined
    };

    onSubmit(deviceData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingDevice ? '장치 수정' : '새 장치 추가'}
          </DialogTitle>
          <DialogDescription>
            {editingDevice 
              ? '장치 설정을 수정하고 연결 상태를 업데이트하세요.' 
              : 'WiFi 설정과 블루투스 연결을 통해 새로운 IoT 장치를 추가하세요.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">기본 설정</TabsTrigger>
              <TabsTrigger value="connection">연결 설정</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">장치 이름</Label>
                <Input
                  id="device-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 거실 카메라"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="device-type">장치 종류</Label>
                <Select value={formData.type} onValueChange={(value: string) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="장치 종류를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">설치 위치</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="예: 거실, 주방, 침실"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mac-address">MAC 주소</Label>
                <Input
                  id="mac-address"
                  value={formData.macAddress}
                  onChange={(e) => handleInputChange('macAddress', e.target.value)}
                  placeholder="AA:BB:CC:DD:EE:FF"
                />
              </div>
            </TabsContent>

            <TabsContent value="connection" className="space-y-4">
              {/* WiFi Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    WiFi 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wifi-name">WiFi 이름 (SSID)</Label>
                    <Input
                      id="wifi-name"
                      value={formData.wifiName}
                      onChange={(e) => handleInputChange('wifiName', e.target.value)}
                      placeholder="WiFi 네트워크 이름"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wifi-password">WiFi 비밀번호</Label>
                    <Input
                      id="wifi-password"
                      type="password"
                      value={formData.wifiPassword}
                      onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
                      placeholder="WiFi 비밀번호"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bluetooth Scan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bluetooth className="w-5 h-5" />
                    블루투스 장치 검색
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startBluetoothScan}
                      disabled={isScanning}
                      className="flex items-center gap-2"
                    >
                      {isScanning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      {isScanning ? '검색 중...' : '장치 검색'}
                    </Button>
                    {scanCompleted && (
                      <Badge variant="outline" className="text-green-600">
                        {bluetoothDevices.length}개 장치 발견
                      </Badge>
                    )}
                  </div>

                  {isScanning && (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">근처 블루투스 장치를 검색 중입니다...</p>
                    </div>
                  )}

                  {bluetoothDevices.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {bluetoothDevices.map((device) => (
                        <div
                          key={device.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            device.connected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:bg-muted/50'
                          }`}
                          onClick={() => !device.connected && !isConnecting && connectToBluetoothDevice(device)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{device.name}</span>
                                {device.connected && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                신호 강도: {device.rssi} dBm
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isConnecting && selectedBluetoothDevice?.id === device.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              ) : device.connected ? (
                                <Badge className="bg-green-600">연결됨</Badge>
                              ) : (
                                <Badge variant="outline">연결 가능</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editingDevice ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}