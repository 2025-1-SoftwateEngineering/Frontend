import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Member } from '../member/types';
import type { LoginRequest, RegisterRequest } from './types';
import { authApi } from './authApi';
import { memberApi } from '../member/memberApi';
import { tokenStorage } from '../../../config/apiConfig';

interface AuthContextValue {
  currentUser: Member | null;
  isLoading:   boolean;
  login:        (req: LoginRequest) => Promise<void>;
  logout:       () => void;
  register:     (req: RegisterRequest) => Promise<void>;
  updateUser:   (data: Partial<Member>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'vocabuddy_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading]     = useState(true);

  // ─── 세션 복원 ──────────────────────────────────────────────────────────────
  // 액세스 토큰이 남아있으면 서버에서 최신 프로필을 가져옵니다.
  // 실패 시 localStorage 캐시를 사용하고, 그것도 없으면 로그아웃 상태로 유지합니다.
  useEffect(() => {
    const restore = async () => {
      const hasToken = Boolean(tokenStorage.getAccessToken());

      let storedMember: Member | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) storedMember = JSON.parse(raw);
      } catch { /* ignore */ }

      if (hasToken) {
        try {
          const member = await authApi.getMyProfile(storedMember?.profileUrl);
          setCurrentUser(member);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
        } catch {
          if (storedMember) setCurrentUser(storedMember);
        }
      } else {
        if (storedMember) setCurrentUser(storedMember);
      }

      setIsLoading(false);
    };

    restore();
  }, []);

  // ─── 로그인 ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (req: LoginRequest) => {
    const { member } = await authApi.login(req);
    setCurrentUser(member);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
  }, []);

  // ─── 로그아웃 ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    tokenStorage.clear(); // 액세스 토큰 + 리프레시 토큰 제거
  }, []);

  // ─── 회원가입 ────────────────────────────────────────────────────────────────
  const register = useCallback(async (req: RegisterRequest) => {
    const { member } = await authApi.register(req);
    // 회원가입 후 자동 로그인 처리
    setCurrentUser(member);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
  }, []);

  // ─── 프로필 업데이트 (백엔드 미제공 엔드포인트 → 로컬 처리) ─────────────────
  const updateUser = useCallback(async (data: Partial<Member>) => {
    if (!currentUser) return;
    // currentUser 전체를 넘겨 기존 필드(profileUrl 등)가 유실되지 않게 병합
    const updated = await memberApi.updateMember(currentUser.member_id, { ...currentUser, ...data });
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [currentUser]);

  // ─── 회원 탈퇴 (백엔드 미제공 엔드포인트 → 로컬 처리) ─────────────────────
  const deleteAccount = useCallback(async () => {
    if (!currentUser) return;
    await memberApi.deleteMember(currentUser.member_id);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    tokenStorage.clear();
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