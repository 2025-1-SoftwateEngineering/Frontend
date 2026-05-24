// ─────────────────────────────────────────────
//  친구 도메인 타입 정의
// ─────────────────────────────────────────────

/** 친구 상태 */
export type FriendStatus = 'FRIEND' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'BLOCKED' | 'NONE';

/** 친구 목록 아이템 */
export interface FriendItem {
  memberId: number;
  username: string;
  nickname: string;
  profileImageUrl?: string;
  level: number;
  status: FriendStatus;
}

/** 친구 요청 아이템 */
export interface FriendRequestItem {
  requestId: number;
  sender: {
    memberId: number;
    username: string;
    nickname: string;
    profileImageUrl?: string;
    level: number;
  };
  createdAt: string;
}

/** 친구 프로필 (상세) */
export interface FriendProfile {
  memberId: number;
  username: string;
  nickname: string;
  profileImageUrl?: string;
  totalWordsLearned: number;
  streakDays: number;
  coin: number;
  isBlocked: boolean;
  status: FriendStatus;
}

/** 사용자 검색 결과 */
export interface UserSearchResult {
  memberId: number;
  username: string;
  nickname: string;
  profileImageUrl?: string;
  level: number;
  status: FriendStatus;
  isBlocked: boolean; // 상대방이 나를 차단한 경우
}

/** API 응답 공통 래퍼 (백엔드 apiPayload 구조에 맞춤) */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
