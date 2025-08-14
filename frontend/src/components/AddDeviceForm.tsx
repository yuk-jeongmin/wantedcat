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
  Activity,
  CheckCircle
} from "lucide-react";
// [핵심] UI 표시용 타입은 CustomBluetoothDevice 라는 별명으로 가져옵니다.
import type { Device, BluetoothDevice as CustomBluetoothDevice }  from "../types";

interface AddDeviceFormProps {
  onClose: () => void;
  onSubmit: (deviceData: Omit<Device, 'id' | 'lastConnected'>) => void;
  editingDevice?: Device | null;
}

const deviceTypes = [
  { value: 'camera', label: '카메라', icon: Camera },
  { value: 'sensor', label: '센서', icon: Activity },
];

export function AddDeviceForm({ onClose, onSubmit, editingDevice }: AddDeviceFormProps) {
  // --- 상태 관리 (State Management) ---

  // 1. 폼 입력 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    type: 'camera',
    wifiName: '',
    wifiPassword: '',
    location: '',
  });

  // [역할 분리] 2. UI 목록에 표시될 장치들의 상태 (우리가 만든 Custom 타입 사용)
  const [uiDevices, setUiDevices] = useState<CustomBluetoothDevice[]>([]);
  
  // [역할 분리] 3. 실제 연결에 사용할 단일 네이티브 장치 객체 상태 🔑
  const [activeBleDevice, setActiveBleDevice] = useState<BluetoothDevice | null>(null);

  // 4. UI 제어를 위한 상태 (로딩, 완료 등)
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  
  // 수정 시 폼 데이터 초기화
  useEffect(() => {
    if (editingDevice) {
      setFormData({
        name: editingDevice.devicename || '',
        type: editingDevice.type || 'camera',
        wifiName: editingDevice.wifiName || '',
        location: editingDevice.location || '',
        wifiPassword: '', 
      });
    }
  }, [editingDevice]);


  // --- 헬퍼 함수 (Helper Functions) ---

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startBluetoothScan = async () => {
    if (!navigator.bluetooth) {
      alert('Web Bluetooth API를 지원하지 않는 브라우저입니다!');
      return;
    }

    setIsScanning(true);
    setScanCompleted(false);
    setUiDevices([]);
    setActiveBleDevice(null);

    try {
      // 1. 브라우저로부터 실제 네이티브 장치 객체를 받습니다.
      const nativeDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });

      // 2. 실제 연결에 사용할 네이티브 객체를 상태에 저장합니다. 🔑
      setActiveBleDevice(nativeDevice);

      // 3. UI에 표시할 커스텀 객체를 만듭니다. 🖼️
      const deviceForUi: CustomBluetoothDevice = {
        id: nativeDevice.id,
        name: nativeDevice.name || 'Unknown Device',
        connected: false,
        rssi: 0, // rssi는 Web Bluetooth API에서 제공하지 않으므로 기본값을 사용합니다.
        type: 'unknown',
      };

      // 4. UI 목록 상태를 업데이트합니다.
      setUiDevices([deviceForUi]);
      setScanCompleted(true);
    } catch (error) {
      console.error('블루투스 장치 검색 실패:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToBluetoothDevice = async () => {
    // 인자를 받는 대신, 상태에 저장된 네이티브 객체를 사용합니다.
    if (!activeBleDevice || !activeBleDevice.gatt) {
      alert('연결할 장치가 선택되지 않았습니다.');
      return;
    }

    setIsConnecting(true);

    try {
      // 1. gatt 서버에 연결합니다.
      await activeBleDevice.gatt.connect();
      console.log(`${activeBleDevice.name}에 성공적으로 연결되었습니다.`);
      
      // 2. 연결에 성공하면 UI 목록의 connected 상태를 true로 업데이트합니다.
      setUiDevices(prev => 
        prev.map(d => 
          d.id === activeBleDevice.id ? { ...d, connected: true } : d
        )
      );

      // 3. 폼 데이터를 자동으로 채웁니다.
      setFormData(prev => ({
        ...prev,
        name: activeBleDevice.name || 'Unknown Device',
      }));

    } catch (error) {
      console.error('블루투스 연결 실패:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deviceData: Omit<Device, 'id' | 'lastConnected'> = {
      devicename: formData.name,
      type: formData.type as Device['type'],
      wifiName: formData.wifiName || undefined,
      location: formData.location || undefined,
    };
    onSubmit(deviceData);
  };

  // --- 렌더링 (JSX) ---

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingDevice ? '장치 수정' : '새 장치 추가'}</DialogTitle>
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
            
            {/* 기본 설정 탭 */}
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
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger><SelectValue placeholder="장치 종류를 선택하세요" /></SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
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
            </TabsContent>
            
            {/* 연결 설정 탭 */}
            <TabsContent value="connection" className="space-y-4">
                            {/* Bluetooth Card */}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Bluetooth className="w-5 h-5" /> 블루투스 장치 검색</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={startBluetoothScan} disabled={isScanning}>
                      {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                      {isScanning ? '검색 중...' : '장치 검색'}
                    </Button>
                    {scanCompleted && <Badge variant="outline" className="text-green-600">{uiDevices.length}개 장치 발견</Badge>}
                  </div>

                  {isScanning && (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">근처 블루투스 장치를 검색 중입니다...</p>
                    </div>
                  )}

                  {uiDevices.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {/* [핵심] UI 렌더링 시에는 uiDevices 상태를 사용합니다. */}
                      {uiDevices.map((device) => (
                        <div
                          key={device.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${device.connected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                          // [핵심] onClick은 더 이상 인자를 전달할 필요 없이 connectToBluetoothDevice 함수를 호출하기만 하면 됩니다.
                          onClick={() => !device.connected && !isConnecting && connectToBluetoothDevice()}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{device.name}</span>
                                {device.connected && <CheckCircle className="w-4 h-4 text-green-600" />}
                              </div>
                              <div className="text-sm text-muted-foreground">신호 강도: {device.rssi} dBm</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isConnecting && activeBleDevice?.id === device.id ? (
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
              {/* WiFi Card */}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Wifi className="w-5 h-5" /> WiFi 설정</CardTitle></CardHeader>
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
                  

            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">{editingDevice ? '수정' : '추가'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}