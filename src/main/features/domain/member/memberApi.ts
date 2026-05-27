import { apiFetch, API_URL } from '../../../config/apiConfig';
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
  id:                  number;
  nickname:            string;
  totalWordsLearned?:  number;
  streak:              number;
  totalStudyDays?:     number;
  coin:                number;
  loginAt:             string;
}

interface FriendRequestListItem {
  id:           number;
  fromMemberId: number;
  nickname:     string;
  state:        FriendState;
}

interface FriendRequestListResult {
  data:       FriendRequestListItem[];
  nextCursor: string;
  hasNext:    boolean;
  pageSize:   number;
}

export type { FriendRequestListItem, FriendRequestListResult };

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

export interface FriendListItem {
  toMemberId: number;
  state:      FriendState;
}

export interface FriendListResult {
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

export interface AlertItem {
  id:        number;
  message:   string;
  repeat:    'NONE' | 'DAY' | 'WEEK';
  alertedAt: string;
}

interface AlertListResult {
  data:          AlertItem[];
  nextCursor:    string;
  hasNext:       boolean;
  totalElements: number;
}

interface AlertDeleteResult {
  id:        number;
  deletedAt: string;
}

interface ReportMemberResult {
  targetMemberId: number;
  reason:         string;
  detailReason:   string | null;
  reportedAt:     string;
}

// ─── Member API ───────────────────────────────────────────────────────────────
export const memberApi = {
  /**
   * GET /api/v1/members/me
   * JWT 토큰으로 내 프로필을 조회합니다.
   */
  getMyProfile: async (): Promise<Partial<Member>> => {
    const res = await apiFetch<{
      nickname:       string;
      email:          string;
      streak:         number;
      totalStudyDays?: number;
      coin:           number;
      authorize?:     string;
      images?:        { imageUrl: string; itemType: string }[];
    }>('/members/me', {}, API_URL);
    return {
      nickname:      res.result?.nickname,
      email:         res.result?.email,
      streak:        res.result?.streak,
      totalStudyDays: res.result?.totalStudyDays,
      coin:          res.result?.coin,
      activeImages:  res.result?.images ?? [],
    };
  },

  /**
   * POST /api/v1/members/search
   * 이메일로 사용자를 검색합니다.
   */
  searchMember: async (email: string): Promise<SearchMemberResult> => {
    const res = await apiFetch<SearchMemberResult>('/members/search', {
      method: 'POST',
      body:   JSON.stringify({ email }),
    }, API_URL);
    return res.result!;
  },

  /**
   * POST /api/v1/members/{memberId}/report
   * 특정 사용자를 신고합니다. (JWT 필요)
   * - reportReason: 'CHEATING' | 'SPAM' 등
   * - detailReason: 상세 사유 (선택)
   */
  reportMember: async (
    memberId:     number,
    reportReason: string,
    detailReason?: string,
  ): Promise<ReportMemberResult> => {
    const res = await apiFetch<ReportMemberResult>(`/members/${memberId}/report`, {
      method: 'POST',
      body:   JSON.stringify({ reportReason, detailReason }),
    }, API_URL);
    return res.result!;
  },

  /**
   * POST /api/v1/friends/{friendId}/request
   * 대상 사용자 ID로 친구 요청을 보냅니다.
   */
  sendFriendRequest: async (friendId: number): Promise<FriendRequestResult> => {
    const res = await apiFetch<FriendRequestResult>(`/friends/${friendId}/request`, {
      method: 'POST',
      body:   JSON.stringify({}),
    }, API_URL);
    return res.result!;
  },

  /**
   * GET /api/v1/friends/{friendId}
   * 친구 프로필을 조회합니다.
   */
  getFriendProfile: async (friendId: number): Promise<FriendProfileResult> => {
    const res = await apiFetch<FriendProfileResult>(`/friends/${friendId}`, {}, API_URL);
    return res.result!;
  },

  /**
   * PATCH /api/v1/friends/{friendId}
   * 들어온 친구 요청 상태를 변경합니다.
   * - state: 'accept' | 'reject' (대소문자 구분 없음)
   */
  updateFriendRequest: async (
    friendId: number,
    state:    'accept' | 'reject',
  ): Promise<FriendStateResult> => {
    const res = await apiFetch<FriendStateResult>(`/friends/${friendId}`, {
      method: 'PATCH',
      body:   JSON.stringify({ state }),
    }, API_URL);
    return res.result!;
  },

  /**
   * PATCH /api/v1/friends/{friendId}/block
   * 친구를 차단합니다.
   */
  blockFriend: async (friendId: number): Promise<BlockFriendResult> => {
    const res = await apiFetch<BlockFriendResult>(`/friends/${friendId}/block`, {
      method: 'PATCH',
      body:   JSON.stringify({}),
    }, API_URL);
    return res.result!;
  },

  /**
   * GET /api/v1/friends
   * 친구 목록을 커서 기반 페이지네이션으로 조회합니다.
   * - cursor: 첫 요청 시 '-1' (기본값)
   */
  getFriends: async (
    cursor:   string = '-1',
    pageSize: number = 10,
  ): Promise<FriendListResult> => {
    const query = new URLSearchParams({ cursor, pageSize: String(pageSize) });
    const res   = await apiFetch<FriendListResult>(`/friends?${query}`, {}, API_URL);
    return res.result!;
  },

  /**
   * GET /api/v1/friends/request
   * 받은 친구 요청 목록을 커서 기반 페이지네이션으로 조회합니다.
   * 항목 구조: { id, fromMemberId, nickname, state }
   */
  getFriendRequests: async (
    cursor:   string = '-1',
    pageSize: number = 10,
  ): Promise<FriendRequestListResult> => {
    const query = new URLSearchParams({ cursor, pageSize: String(pageSize) });
    const res   = await apiFetch<FriendRequestListResult>(`/friends/request?${query}`, {}, API_URL);
    return res.result!;
  },

  /**
   * DELETE /api/v1/friends/{friendId}
   * 친구를 삭제합니다.
   */
  deleteFriend: async (friendId: number): Promise<void> => {
    await apiFetch<unknown>(`/friends/${friendId}`, { method: 'DELETE' }, API_URL);
  },

  /**
   * POST /api/v1/fcm
   * FCM 토큰을 백엔드에 등록합니다. (JWT 필요)
   */
  registerFcmToken: async (fcmToken: string): Promise<FcmTokenResult> => {
    const res = await apiFetch<FcmTokenResult>('/fcm', {
      method: 'POST',
      body:   JSON.stringify({ fcmToken }),
    }, API_URL);
    return res.result!;
  },

  /**
   * POST /api/v1/alerts/custom
   * 커스텀 알림을 등록합니다. (JWT 필요)
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
    }, API_URL);
    return res.result!;
  },

  /**
   * GET /api/v1/alerts
   * 내가 등록한 커스텀 알림 목록을 커서 기반으로 조회합니다. (JWT 필요)
   * - cursor: 첫 요청 시 '-1' 또는 생략
   */
  getAlerts: async (
    cursor:   string = '-1',
    pageSize: number = 10,
  ): Promise<AlertListResult> => {
    const query = new URLSearchParams({ cursor, pageSize: String(pageSize) });
    const res   = await apiFetch<AlertListResult>(`/alerts?${query}`, {}, API_URL);
    return res.result!;
  },

  /**
   * DELETE /api/v1/alerts/{alertId}
   * 특정 알림을 삭제합니다. (JWT 필요, 본인 알림만 삭제 가능)
   */
  deleteAlert: async (alertId: number): Promise<AlertDeleteResult> => {
    const res = await apiFetch<AlertDeleteResult>(`/alerts/${alertId}`, {
      method: 'DELETE',
    }, API_URL);
    return res.result!;
  },

  /**
   * PATCH /api/v1/members/me
   * 닉네임·이메일을 수정합니다. confirmPassword 필수.
   */
  updateProfile: async (params: {
    nickname?:       string;
    email?:          string;
    confirmPassword: string;
  }): Promise<{ email: string; nickname: string }> => {
    const res = await apiFetch<{ email: string; nickname: string }>('/members/me', {
      method: 'PATCH',
      body:   JSON.stringify(params),
    }, API_URL);
    return res.result!;
  },

  // ─── 백엔드 미제공 엔드포인트 (로컬 처리 유지) ───────────────────────────────

  updateMember: async (_memberId: number, data: Partial<Member>): Promise<Member> => {
    const now = new Date().toISOString();
    return {
      member_id:    _memberId,
      email:        data.email        ?? '',
      nickname:     data.nickname     ?? '',
      authorize:    data.authorize    ?? 'ROLE_USER',
      login_at:     data.login_at     ?? now,
      streak:       data.streak       ?? 0,
      coin:         data.coin         ?? 0,
      created_at:   data.created_at   ?? now,
      updated_at:   now,
      deleted_at:   data.deleted_at   ?? null,
      activeImages: data.activeImages ?? [],
      profileUrl:   data.profileUrl   ?? '',
      ...data,
    };
  },

  deleteMember: async (_memberId: number): Promise<void> => {
    console.warn('[memberApi] deleteMember: 백엔드 API 미제공 - 로컬 상태만 초기화됩니다.');
  },
};
