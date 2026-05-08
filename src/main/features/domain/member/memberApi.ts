import { apiFetch } from '../../../config/apiConfig';
import type { Member, FriendState } from './types';

// ─── 백엔드 응답 타입 ──────────────────────────────────────────────────────────

interface SearchMemberResult {
  id:       number;
  nickname: string;
  email:    string;
}

interface FriendRequestResult {
  id:       number;
  nickname: string;
}

interface FriendProfileResult {
  id:       number;
  nickname: string;
  streak:   number;
  coin:     number;
  loginAt:  string;
}

interface FriendStateResult {
  id:       number;
  nickname: string;
  state:    FriendState;
}

interface BlockFriendResult {
  id:        number;
  nickname:  string;
  blockedAt: string;
}

interface FriendListItem {
  toMemberId: number;
  state:      FriendState;
}

interface FriendListResult {
  data:       FriendListItem[];
  nextCursor: string;
  hasNext:    boolean;
  pageSize:   number;
}

interface FcmTokenResult {
  memberId:     number;
  registeredAt: string;
}

interface CustomAlertResult {
  message:   string;
  repeat:    'NONE' | 'DAY' | 'WEEK';
  alertedAt: string;
}

// ─── Member API ───────────────────────────────────────────────────────────────
export const memberApi = {
  /**
   * GET /auth/v1/members/me
   * JWT 토큰으로 내 프로필을 조회합니다.
   */
  getMyProfile: async (): Promise<Partial<Member>> => {
    const res = await apiFetch<{
      id?:      number;
      nickname: string;
      email:    string;
      streak:   number;
      coin:     number;
    }>('/members/me');
    return {
      member_id: res.result?.id ?? 0,
      nickname:  res.result?.nickname,
      email:     res.result?.email,
      streak:    res.result?.streak,
      coin:      res.result?.coin,
    };
  },

  /**
   * POST /auth/v1/members/search
   * 이메일로 사용자를 검색합니다. (친구 추가 등 용도)
   */
  searchMember: async (email: string): Promise<SearchMemberResult> => {
    const res = await apiFetch<SearchMemberResult>('/members/search', {
      method: 'POST',
      body:   JSON.stringify({ email }),
    });
    return res.result!;
  },

  /**
   * POST /auth/v1/friends/{friendId}/request
   * 대상 사용자 ID로 친구 요청을 보냅니다.
   * searchMember로 상대방 ID를 먼저 파악하세요.
   */
  sendFriendRequest: async (friendId: number): Promise<FriendRequestResult> => {
    const res = await apiFetch<FriendRequestResult>(`/friends/${friendId}/request`, {
      method: 'POST',
      body:   JSON.stringify({}),
    });
    return res.result!;
  },

  /**
   * GET /auth/v1/friends/{friendId}
   * 친구 프로필을 조회합니다. (친구 관계여야 합니다)
   */
  getFriendProfile: async (friendId: number): Promise<FriendProfileResult> => {
    const res = await apiFetch<FriendProfileResult>(`/friends/${friendId}`);
    return res.result!;
  },

  /**
   * PATCH /auth/v1/friends/{friendId}
   * 들어온 친구 요청의 상태를 변경합니다.
   * - state: 'accept' 또는 'reject' (대소문자 구분 없음)
   */
  updateFriendRequest: async (
    friendId: number,
    state:    'accept' | 'reject',
  ): Promise<FriendStateResult> => {
    const res = await apiFetch<FriendStateResult>(`/friends/${friendId}`, {
      method: 'PATCH',
      body:   JSON.stringify({ state }),
    });
    return res.result!;
  },

  /**
   * PATCH /auth/v1/friends/{friendId}/block
   * 친구를 차단합니다. (친구 관계여야 합니다)
   */
  blockFriend: async (friendId: number): Promise<BlockFriendResult> => {
    const res = await apiFetch<BlockFriendResult>(`/friends/${friendId}/block`, {
      method: 'PATCH',
      body:   JSON.stringify({}),
    });
    return res.result!;
  },

  /**
   * GET /auth/v1/friends
   * 친구 목록을 커서 기반 페이지네이션으로 조회합니다.
   * - cursor: 첫 요청 시 '-1' (기본값)
   * - pageSize: 한 번에 가져올 수 (기본값 10)
   */
  getFriends: async (
    cursor:   string  = '-1',
    pageSize: number  = 10,
  ): Promise<FriendListResult> => {
    const query = new URLSearchParams({ cursor, pageSize: String(pageSize) });
    const res   = await apiFetch<FriendListResult>(`/friends?${query}`);
    return res.result!;
  },

  /**
   * GET /auth/v1/friends/request
   * 받은 친구 요청 목록을 커서 기반 페이지네이션으로 조회합니다.
   * - cursor: 첫 요청 시 '-1' (기본값)
   * - pageSize: 한 번에 가져올 수 (기본값 10)
   */
  getFriendRequests: async (
    cursor:   string = '-1',
    pageSize: number = 10,
  ): Promise<FriendListResult> => {
    const query = new URLSearchParams({ cursor, pageSize: String(pageSize) });
    const res   = await apiFetch<FriendListResult>(`/friends/request?${query}`);
    return res.result!;
  },

  /**
   * POST /auth/v1/fcm
   * FCM 토큰을 백엔드에 등록합니다.
   * (firebaseConfig.ts의 registerFcmToken()이 내부적으로 호출합니다)
   */
  registerFcmToken: async (fcmToken: string): Promise<FcmTokenResult> => {
    const res = await apiFetch<FcmTokenResult>('/fcm', {
      method: 'POST',
      body:   JSON.stringify({ fcmToken }),
    });
    return res.result!;
  },

  /**
   * POST /auth/v1/alerts/custom
   * 커스텀 알림을 등록합니다.
   * - repeat: 'NONE' | 'DAY' | 'WEEK'
   * - alertedAt: UTC 형식 (예: "2026-05-04T05:01:21.821Z")
   */
  setCustomAlert: async (
    message:   string,
    repeat:    'NONE' | 'DAY' | 'WEEK',
    alertedAt: string,
  ): Promise<CustomAlertResult> => {
    const res = await apiFetch<CustomAlertResult>('/alerts/custom', {
      method: 'POST',
      body:   JSON.stringify({ message, repeat, alertedAt }),
    });
    return res.result!;
  },

  // ─── 백엔드 미제공 엔드포인트 (로컬 처리 유지) ───────────────────────────────

  /** ※ 백엔드 미제공 - 프로필 수정 API 추가 시 연동. 현재는 로컬 상태만 변경 */
  updateMember: async (_memberId: number, data: Partial<Member>): Promise<Member> => {
    const now = new Date().toISOString();
    // AuthContext에서 currentUser와 병합하므로 data + 최소 필드만 반환
    return {
      member_id:  _memberId,
      email:      data.email      ?? '',
      nickname:   data.nickname   ?? '',
      authorize:  data.authorize  ?? 'ROLE_USER',
      login_at:   data.login_at   ?? now,
      streak:     data.streak     ?? 0,
      coin:       data.coin       ?? 0,
      created_at: data.created_at ?? now,
      updated_at: now,
      deleted_at: data.deleted_at ?? null,
      ...data,
    };
  },

  /** ※ 백엔드 미제공 - 회원 탈퇴 API 추가 시 연동. 현재는 로컬 처리만 */
  deleteMember: async (_memberId: number): Promise<void> => {
    // 실제 탈퇴 API 연동 전까지 아무 동작 없음
    console.warn('[memberApi] deleteMember: 백엔드 API 미제공 - 로컬 상태만 초기화됩니다.');
  },
};