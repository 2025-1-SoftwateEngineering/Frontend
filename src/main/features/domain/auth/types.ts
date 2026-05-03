export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
  /** 프론트엔드 편의 플래그: true → ROLE_ADMIN 요청, false → ROLE_USER */
  isAdmin: boolean;
}
