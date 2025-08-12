import type { Device } from '../types';

export const initialDevices: Device[] = [
  {
    id: 1,
    name: "거실 카메라",
    type: "camera",
    wifiName: "CatHome_WiFi",
    location: "거실"
  },

  {
    id: 5,
    name: "온습도 센서",
    type: "sensor",
    wifiName: "CatHome_WiFi",
    location: "침실"
  }
];