import { MOCK_USERS, delay } from '../../../../test/mockData';
import type { Member } from './types';

// ─── Member API (maps to backend /member) ────────────────────────────────────
export const memberApi = {
  updateMember: async (id: number, data: Partial<Member>): Promise<Member> => {
    await delay(500);
    const found = MOCK_USERS.find((u) => u.member.id === id);
    if (!found) throw new Error('사용자를 찾을 수 없습니다.');
    found.member = { ...found.member, ...data };
    return found.member;
  },

  deleteMember: async (id: number): Promise<void> => {
    await delay(500);
    const idx = MOCK_USERS.findIndex((u) => u.member.id === id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
  },
};
