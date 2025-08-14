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
  devicename: string;
  type: 'camera' | 'sensor';
  wifiName?: string;
  location?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  type: string;
  connected: boolean;
}