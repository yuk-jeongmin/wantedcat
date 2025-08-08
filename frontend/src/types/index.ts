export type BoardType = 'info' | 'qna' | 'notice';
export type MenuType = 'dashboard' | 'management' | 'board' | 'home-cam' | 'schedule' | 'statistics' | 'my-page' | 'admin';
export type ManagementType = 'cats' | 'devices';
export type AuthPage = 'login' | 'signup';

export interface UserData {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  joinDate: string;
  streamkey: string;
  role: 'user' | 'admin';
}

export interface Device {
  id: number;
  name: string;
  type: 'camera' | 'feeder' | 'water-dispenser' | 'tracker' | 'sensor';
  status: 'online' | 'offline' | 'error';
  macAddress: string;
  lastConnected: string;
  wifiName?: string;
  batteryLevel?: number;
  location?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  type: string;
  connected: boolean;
}