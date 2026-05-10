import type {
  ApiResponse,
  FriendItem,
  FriendProfile,
  FriendRequestItem,
  UserSearchResult,
} from './friendTypes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<ApiResponse<T>>;
}

// 친구 목록 조회
export const getFriendList = () =>
  apiFetch<FriendItem[]>('/api/v1/friends');

// 친구 요청 목록 조회
export const getFriendRequests = () =>
  apiFetch<FriendRequestItem[]>('/api/v1/friends/request');

// 친구 요청 보내기
export const sendFriendRequest = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}/request`, { method: 'POST' });

// 친구 요청 수락 or 거절 (PATCH /api/v1/friends/{friendId})
export const acceptFriendRequest = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ACCEPTED' }),
  });

export const rejectFriendRequest = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'REJECTED' }),
  });

// 친구 차단
export const blockUser = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}/block`, { method: 'PATCH' });

// 친구 프로필 조회
export const getFriendProfile = (friendId: number) =>
  apiFetch<FriendProfile>(`/api/v1/friends/${friendId}`);

// 사용자 검색
export const searchUserByUsername = (email: string) =>
  apiFetch<UserSearchResult>('/api/v1/members/search', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

// 내 프로필 조회
export const getMyProfile = () =>
  apiFetch<FriendProfile>('/api/v1/members/me');

// 차단 해제 (Swagger에 없으면 백엔드 팀 확인 필요)
export const unblockUser = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}/block`, { method: 'DELETE' });

// 친구 삭제 (Swagger에 없으면 백엔드 팀 확인 필요)
export const deleteFriend = (friendId: number) =>
  apiFetch<null>(`/api/v1/friends/${friendId}`, { method: 'DELETE' });