import { MOCK_USERS, delay } from '../../../../test/mockData';
import type { Member } from '../member/types';
import type { LoginRequest, RegisterRequest } from './types';

// ─── Auth API (maps to backend /auth) ────────────────────────────────────────
export const authApi = {
  login: async (req: LoginRequest): Promise<{ member: Member; token: string }> => {
    await delay(600);
    const found = MOCK_USERS.find((u) => u.member.email === req.email);
    if (!found || found.password !== req.password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    return { member: found.member, token: `mock-token-${Date.now()}` };
  },

  register: async (req: RegisterRequest): Promise<void> => {
    await delay(800);
    if (MOCK_USERS.some((u) => u.member.email === req.email)) {
      throw new Error('이미 사용중인 이메일입니다.');
    }
    const now = new Date().toISOString();
    const newMember: Member = {
      member_id: Date.now(),
      email: req.email,
      nickname: req.nickname,
      authorize: req.isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER',
      login_at: now,
      streak: 0,
      coin: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    MOCK_USERS.push({ password: req.password, member: newMember });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await delay(700);
    const found = MOCK_USERS.find((u) => u.member.email === email);
    if (!found) throw new Error('해당 이메일로 가입된 계정이 없습니다.');
    // 실제 백엔드: 임시 비밀번호를 이메일로 전송
  },
};
