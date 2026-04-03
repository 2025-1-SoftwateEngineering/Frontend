// domain/auth에 대응하는 서비스
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('로그인 실패');
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('로그아웃 실패');
    return res.json();
  },

  async signup(data) {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('회원가입 실패');
    return res.json();
  },

  async requestAdminSignup(data) {
    const res = await fetch(`${API_BASE}/api/auth/admin-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('관리자 가입 요청 실패');
    return res.json();
  },

  async sendPasswordResetEmail(email) {
    const res = await fetch(`${API_BASE}/api/auth/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('비밀번호 재설정 이메일 발송 실패');
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('인증 실패');
    return res.json();
  },
};
