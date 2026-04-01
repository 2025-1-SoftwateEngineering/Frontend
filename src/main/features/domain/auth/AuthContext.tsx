import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Member } from '../member/types';
import type { LoginRequest, RegisterRequest } from './types';
import { authApi } from './authApi';
import { memberApi } from '../member/memberApi';

interface AuthContextValue {
  currentUser: Member | null;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (req: RegisterRequest) => Promise<void>;
  updateUser: (data: Partial<Member>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'scoi_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 세션 복원
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (req: LoginRequest) => {
    const { member } = await authApi.login(req);
    setCurrentUser(member);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const register = useCallback(async (req: RegisterRequest) => {
    await authApi.register(req);
  }, []);

  const updateUser = useCallback(async (data: Partial<Member>) => {
    if (!currentUser) return;
    const updated = await memberApi.updateMember(currentUser.id, data);
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [currentUser]);

  const deleteAccount = useCallback(async () => {
    if (!currentUser) return;
    await memberApi.deleteMember(currentUser.id);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, register, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
