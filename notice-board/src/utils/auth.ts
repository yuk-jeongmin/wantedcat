import type { UserData } from '../types';
import { mockUsers } from '../data/mockUsers';

export const handleLogin = async (email: string, password: string): Promise<UserData | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check credentials
  const user = mockUsers.find(u => u.email === email);
  if (user && ((email === 'catowner@gmail.com' && password === 'password123') || 
               (email === 'admin@catcommunity.com' && password === 'admin123'))) {
    return user;
  }
  return null;
};

export const handleSignup = async (userData: {
  email: string;
  name: string;
  phone: string;
  password: string;
}): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return false;
  }
  
  // Create new user
  const newUser: UserData = {
    id: Math.max(...mockUsers.map(u => u.id)) + 1,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: "",
    joinDate: new Date().toISOString(),
    role: "user"
  };
  
  mockUsers.push(newUser);
  return true;
};