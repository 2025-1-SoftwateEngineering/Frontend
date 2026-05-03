import { MOCK_USERS, delay } from '../../../../test/mockData';
import type { Member } from './types';

// ─── Member API (maps to backend /member) ────────────────────────────────────
export const memberApi = {
  updateMember: async (member_id: number, data: Partial<Member>): Promise<Member> => {
    await delay(500);
    const found = MOCK_USERS.find((u) => u.member.member_id === member_id);
    if (!found) throw new Error('사용자를 찾을 수 없습니다.');
    found.member = { ...found.member, ...data, updated_at: new Date().toISOString() };
    return found.member;
  },

  deleteMember: async (member_id: number): Promise<void> => {
    await delay(500);
    const found = MOCK_USERS.find((u) => u.member.member_id === member_id);
    if (found) {
      // soft delete: deleted_at 설정
      found.member.deleted_at = new Date().toISOString();
    }
  },
};
