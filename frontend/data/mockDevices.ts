import type { Device } from '../types';

export const initialDevices: Device[] = [
  {
    id: 1,
    name: "거실 카메라",
    type: "camera",
    status: "online",
    macAddress: "AA:BB:CC:DD:EE:01",
    lastConnected: "2025-01-05T10:30:00Z",
    wifiName: "CatHome_WiFi",
    location: "거실"
  },
  {
    id: 2,
    name: "자동 급식기",
    type: "feeder",
    status: "online",
    macAddress: "AA:BB:CC:DD:EE:02",
    lastConnected: "2025-01-05T09:45:00Z",
    wifiName: "CatHome_WiFi",
    batteryLevel: 85,
    location: "주방"
  },
  {
    id: 3,
    name: "물통 센서",
    type: "water-dispenser",
    status: "offline",
    macAddress: "AA:BB:CC:DD:EE:03",
    lastConnected: "2025-01-04T18:20:00Z",
    wifiName: "CatHome_WiFi",
    batteryLevel: 45,
    location: "거실"
  },
  {
    id: 4,
    name: "나비 GPS 트래커",
    type: "tracker",
    status: "online",
    macAddress: "AA:BB:CC:DD:EE:04",
    lastConnected: "2025-01-05T11:15:00Z",
    batteryLevel: 92,
    location: "나비 목걸이"
  },
  {
    id: 5,
    name: "온습도 센서",
    type: "sensor",
    status: "error",
    macAddress: "AA:BB:CC:DD:EE:05",
    lastConnected: "2025-01-03T14:30:00Z",
    wifiName: "CatHome_WiFi",
    batteryLevel: 12,
    location: "침실"
  }
];