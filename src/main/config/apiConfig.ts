// ============================================================
//  ★ 백엔드 주소는 여기 한 곳만 수정하면 전체에 반영됩니다 ★
// ============================================================
export const BACKEND_URL = 'https://vocabuddy.site/';
// ============================================================

export const BASE_URL = `${BACKEND_URL}/auth/v1`;
export const ADMIN_URL = `${BACKEND_URL}/admin/v1`;

// ─── 토큰 로컬스토리지 관리 ────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY  = 'vocabuddy_access_token';
const REFRESH_TOKEN_KEY = 'vocabuddy_refresh_token';

export const tokenStorage = {
  getAccessToken:  (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY,  accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clear: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ─── 공통 응답 타입 ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code:      string;
  message:   string;
  result:    T | null;
}

// ─── 토큰 재발급 ────────────────────────────────────────────────────────────────
async function reissueTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/reissue`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });
    const data: ApiResponse<{ accessToken: string; refreshToken: string; refreshExpiration: string }> =
      await res.json();

    if (data.isSuccess && data.result) {
      tokenStorage.setTokens(data.result.accessToken, data.result.refreshToken);
      return true;
    }
  } catch {
    // 재발급 실패
  }
  return false;
}

// ─── 인증 헤더 빌더 ───────────────────────────────────────────────────────────
function authHeaders(): Record<string, string> {
  const token = tokenStorage.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── 공통 fetch 래퍼 (자동 토큰 갱신 포함) ────────────────────────────────────
export async function apiFetch<T = unknown>(
  path:    string,
  options: RequestInit = {},
  baseUrl: string = BASE_URL,
): Promise<ApiResponse<T>> {
  const buildHeaders = () => ({
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  });

  let res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: buildHeaders(),
  });

  // 401 → 토큰 재발급 후 1회 재시도
  if (res.status === 401) {
    const reissued = await reissueTokens();
    if (reissued) {
      res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: buildHeaders(),
      });
    }
  }

  const data: ApiResponse<T> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message ?? '요청 처리 중 오류가 발생했습니다.');
  }

  return data;
}
