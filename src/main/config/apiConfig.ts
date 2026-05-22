// ============================================================
//  ★ 백엔드 주소는 여기 한 곳만 수정하면 전체에 반영됩니다 ★
// ============================================================
export const BACKEND_URL = "https://vocabuddy.site";
// ============================================================

export const BASE_URL   = `${BACKEND_URL}/auth/v1`;
export const API_URL    = `${BACKEND_URL}/api/v1`;
export const ADMIN_URL  = `${BACKEND_URL}/admin/v1`;

// ─── 플레이스홀더 감지 ─────────────────────────────────────────────────────────
function assertUrlConfigured(url: string) {
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    throw new Error(
      "[VocaBuddy] 백엔드 주소가 설정되지 않았습니다.\n" +
        "src/main/config/apiConfig.ts 의 BACKEND_URL 을 실제 서버 주소로 교체해 주세요.\n" +
        '예) export const BACKEND_URL = "http://123.456.789.0:8080";',
    );
  }
}

// ─── 토큰 로컬스토리지 관리 ────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = "vocabuddy_access_token";
const REFRESH_TOKEN_KEY = "vocabuddy_refresh_token";

export const tokenStorage = {
  getAccessToken: (): string | null =>
    localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null =>
    localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (
    accessToken: string,
    refreshToken: string,
  ): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
  code: string;
  message: string;
  result: T | null;
}

// ─── JSON 안전 파싱 ────────────────────────────────────────────────────────────
async function safeJson<T>(
  res: Response,
): Promise<ApiResponse<T>> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    // HTML 오류 페이지 등 JSON이 아닌 응답이 왔을 때
    const text = await res
      .text()
      .catch(() => "(응답 본문 없음)");
    throw new Error(
      `[VocaBuddy] 서버가 JSON 대신 다른 형식을 반환했습니다 (HTTP ${res.status}).\n` +
        `BACKEND_URL 이 올바른지, 서버가 실행 중인지 확인해 주세요.\n` +
        `응답 앞부분: ${text.slice(0, 120)}`,
    );
  }
  return res.json() as Promise<ApiResponse<T>>;
}

// ─── 토큰 재발급 ────────────────────────────────────────────────────────────────
async function reissueTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await safeJson<{
      accessToken: string;
      refreshToken: string;
      refreshExpiration: string;
    }>(res);

    if (data.isSuccess && data.result) {
      tokenStorage.setTokens(
        data.result.accessToken,
        data.result.refreshToken,
      );
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
  path: string,
  options: RequestInit = {},
  baseUrl: string = BASE_URL,
): Promise<ApiResponse<T>> {
  // URL 설정 여부 먼저 확인
  assertUrlConfigured(baseUrl);

  const buildHeaders = () => ({
    "Content-Type": "application/json",
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

  const data = await safeJson<T>(res);

  if (!data.isSuccess) {
    throw new Error(
      data.message ?? "요청 처리 중 오류가 발생했습니다.",
    );
  }

  return data;
}