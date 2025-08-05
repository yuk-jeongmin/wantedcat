import type { UserData } from '../types';

export const canEditItem = (currentUser: UserData | null, author: string): boolean => {
  return currentUser?.name === author || currentUser?.role === 'admin';
};

export const canDeleteItem = (currentUser: UserData | null, author: string): boolean => {
  return currentUser?.name === author || currentUser?.role === 'admin';
};

export const canCreateNotice = (currentUser: UserData | null): boolean => {
  return currentUser?.role === 'admin';
};