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
  streamKey?: string | null;
  user_email?: string | null;
}

const deviceTypes = [
  { value: 'camera', label: '카메라', icon: Camera },
  { value: 'sensor', label: '센서', icon: Activity },
];

const WIFI_SERVICE_UUID = 'e5f00001-3a12-4a9b-9f65-1d2c3b4a5f60'; // 예시: 커스텀 서비스
const WIFI_CHARACTERISTIC_UUID = 'e5f00002-3a12-4a9b-9f65-1d2c3b4a5f60'; // 예시: 커스텀 특성

export function AddDeviceForm({ onClose, onSubmit, editingDevice, streamKey, user_email }: AddDeviceFormProps) {
  // --- 상태 관리 (State Management) ---

  const [formData, setFormData] = useState({
    name: '',
    type: 'camera',
    wifiName: '',
    wifiPassword: '',
    location: '',
    homecamIp:'',
  });

  const [uiDevices, setUiDevices] = useState<CustomBluetoothDevice[]>([]);
  const [activeBleDevice, setActiveBleDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (editingDevice) {
      setFormData({
        name: editingDevice.devicename || '',
        type: editingDevice.type || 'camera',
        wifiName: editingDevice.wifiName || '',
        location: editingDevice.location || '',
        wifiPassword: '', 
        homecamIp:'',
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
      const nativeDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [WIFI_SERVICE_UUID]
        });
      setActiveBleDevice(nativeDevice);

      const deviceForUi: CustomBluetoothDevice = {
        id: nativeDevice.id,
        blename: nativeDevice.name || 'Unknown Device',
        connected: false,
        rssi: 0,
        type: 'unknown',
      };

      setUiDevices([deviceForUi]);
      setScanCompleted(true);
    } catch (error) {
      console.error('블루투스 장치 검색 실패:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToBluetoothDevice = async () => {
    if (!activeBleDevice || !activeBleDevice.gatt) {
      alert('연결할 장치가 선택되지 않았습니다.');
      return;
    }

    setIsConnecting(true);

    try {
      await activeBleDevice.gatt.connect();
      console.log(`${activeBleDevice.name}에 성공적으로 연결되었습니다.`);
      setIsConnected(true);
      setUiDevices(prev => 
        prev.map(d => 
          d.id === activeBleDevice.id ? { ...d, connected: true } : d
        )
      );

    } catch (error) {
      console.error('블루투스 연결 실패:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // [추가된 기능] WiFi 정보 및 스트림 키 전송 함수
  const handleSendWifiCredentials = async () => {
    // [중요] 이 UUID들은 실제 블루투스 장치에 설정된 값으로 반드시 교체해야 합니다.
    // 펌웨어 개발자에게 문의하여 정확한 값을 받으세요.

    // 1. 블루투스 연결 상태 확인
    if (!activeBleDevice || !activeBleDevice.gatt?.connected) {
      alert('블루투스 장치가 연결되어 있지 않습니다.');
      return;
    }

    // 2. 전송할 데이터 준비
    const { wifiName, wifiPassword, homecamIp } = formData;

    if (!wifiName || !wifiPassword) {
      alert('WiFi 이름과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      console.log('데이터를 전송 준비 중...');

      // 3. 데이터를 JSON 문자열로 변환 후, 바이트 배열(Uint8Array)로 인코딩
      // 블루투스는 텍스트가 아닌 바이트 단위로 통신하기 때문에 변환이 필수입니다.
      const dataToSend = {
        ssid: wifiName,
        password: wifiPassword,
        key: streamKey,
        user_email:user_email,
        homecamIp:homecamIp
      };
      const jsonString = JSON.stringify(dataToSend);
      const value = new TextEncoder().encode(jsonString);

      console.log(`전송할 데이터: ${jsonString}`);

      // 4. 올바른 서비스와 특성을 찾아 데이터 쓰기
      const service = await activeBleDevice.gatt.getPrimaryService(WIFI_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(WIFI_CHARACTERISTIC_UUID);

      // writeValueWithResponse: 장치로부터 "잘 받았다"는 응답을 기다리는, 더 안정적인 쓰기 방식
      await characteristic.writeValueWithResponse(value);

      alert('데이터를 성공적으로 전송했습니다!');

    } catch (error) {
      console.error('데이터 전송 실패:', error);
      alert(`데이터 전송 중 오류가 발생했습니다: ${error}`);
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
        {/* DialogHeader, form, Tabs 등 기존 JSX는 동일 */}
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
                                <span className="font-medium">{device.blename}</span>
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
                                <Badge variant="outline">페어링 검사</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* WiFi Card - 전송 버튼 로직이 연결됨 */}
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

                  <div className="space-y-2">
                    <Label htmlFor="wifi-password">홈캠 IP</Label>
                    <Input
                      id="homecam-ip"
                      type="ip"
                      value={formData.homecamIp}
                      onChange={(e) => handleInputChange('homecamIp', e.target.value)}
                      placeholder="홈캠 IP"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stream-key">스트림 키</Label>
                    <Input
                      id="stream-key"
                      value={streamKey || '세션에서 키를 찾을 수 없습니다.'}
                      readOnly // 이 속성으로 인해 입력창이 수정 불가능하게 됩니다.
                      className="bg-muted text-muted-foreground" // 시각적으로 비활성화된 것처럼 보이게 함
                    />
                  </div>


                  <div className="pt-2">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleSendWifiCredentials} // onClick 이벤트에 함수 연결
                      disabled={!isConnected || isConnecting}
                    >
                      전송
                    </Button>
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