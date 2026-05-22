import { apiFetch, API_URL, tokenStorage } from '../../../config/apiConfig';
import type { Member, Authorize } from '../member/types';
import type { LoginRequest, RegisterRequest } from './types';

// ─── Auth API 응답 타입 ────────────────────────────────────────────────────────
interface AuthTokenResult {
  accessToken:       string;
  refreshToken:      string;
  refreshExpiration: string;
}

interface MyProfileResult {
  id?:        number;
  nickname:   string;
  email:      string;
  streak:     number;
  coin:       number;
  authorize?: string;
}

// /members/me 결과를 Member 타입으로 변환
function toMember(profile: MyProfileResult): Member {
  const now = new Date().toISOString();
  return {
    member_id:  profile.id ?? 0,
    email:      profile.email,
    nickname:   profile.nickname,
    authorize:  (profile.authorize as Authorize) ?? 'ROLE_USER',
    login_at:   now,
    streak:     profile.streak,
    coin:       profile.coin,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /auth/v1/login
   * 로그인 후 토큰을 저장하고, 내 프로필을 조회하여 Member 객체를 반환합니다.
   */
  login: async (req: LoginRequest): Promise<{ member: Member; token: string }> => {
    const authRes = await apiFetch<AuthTokenResult>('/login', {
      method: 'POST',
      body:   JSON.stringify({ email: req.email, password: req.password }),
    });

    const { accessToken, refreshToken } = authRes.result!;
    tokenStorage.setTokens(accessToken, refreshToken);

    // 프로필 조회
    const profileRes = await apiFetch<MyProfileResult>('/members/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }, API_URL);
    const member = toMember(profileRes.result!);

    return { member, token: accessToken };
  },

  /**
   * POST /auth/v1/sign-up
   * 회원가입 후 자동 로그인(토큰 저장)하고, 내 프로필을 조회하여 Member 객체를 반환합니다.
   */
  register: async (req: RegisterRequest): Promise<{ member: Member; token: string }> => {
    const authRes = await apiFetch<AuthTokenResult>('/sign-up', {
      method: 'POST',
      body:   JSON.stringify({
        nickname: req.nickname,
        email:    req.email,
        password: req.password,
      }),
    });

    const { accessToken, refreshToken } = authRes.result!;
    tokenStorage.setTokens(accessToken, refreshToken);

    // 프로필 조회
    const profileRes = await apiFetch<MyProfileResult>('/members/me', {}, API_URL);
    const member = toMember(profileRes.result!);

    return { member, token: accessToken };
  },

  /**
   * POST /auth/v1/reissue
   * 리프레시 토큰으로 액세스 토큰을 재발급합니다.
   * (apiFetch 내부에서 자동 호출되므로 직접 호출할 필요는 거의 없습니다.)
   */
  reissue: async (refreshToken: string): Promise<AuthTokenResult> => {
    const res = await apiFetch<AuthTokenResult>('/reissue', {
      method: 'POST',
      body:   JSON.stringify({ refreshToken }),
    });
    return res.result!;
  },

  /**
   * GET /auth/v1/members/me
   * 현재 로그인된 사용자의 프로필을 가져옵니다.
   * 세션 복원 시 사용합니다.
   */
  getMyProfile: async (): Promise<Member> => {
    const res = await apiFetch<MyProfileResult>('/members/me', {}, API_URL);
    return toMember(res.result!);
  },

  /**
   * ※ 백엔드 미제공 엔드포인트 (추후 연동 예정)
   * 비밀번호 찾기 - 현재 스텁으로 처리
   */
  forgotPassword: async (_email: string): Promise<void> => {
    throw new Error('비밀번호 찾기는 현재 지원되지 않습니다.');
  },
};