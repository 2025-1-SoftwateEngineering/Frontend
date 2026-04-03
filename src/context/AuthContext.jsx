import { createContext, useContext, useState, useEffect } from 'react';
import { demoUser, demoAdmin } from '../data/vocaData';

const AuthContext = createContext(null);

// 백엔드 연동 전 로컬 스토리지 기반 데모 인증
const STORAGE_KEY = 'voca_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // 백엔드 미연결 시 데모 계정으로 동작
    if (email === demoAdmin.email && password === demoAdmin.password) {
      const u = { ...demoAdmin };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return u;
    }
    if (email === demoUser.email && password === demoUser.password) {
      const u = { ...demoUser };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return u;
    }
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const signup = async (data) => {
    // 데모: 회원가입 후 자동 로그인 (관리자 요청은 제외)
    if (data.isAdmin) {
      return { success: true, message: '관리자 가입 요청이 전송되었습니다.' };
    }
    const newUser = {
      id: Date.now(),
      email: data.email,
      nickname: data.nickname,
      profileImage: data.profileImage || null,
      profileBackground: null,
      level: 1,
      exp: 0,
      maxExp: 1000,
      isAdmin: false,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const withdraw = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUser, withdraw }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
