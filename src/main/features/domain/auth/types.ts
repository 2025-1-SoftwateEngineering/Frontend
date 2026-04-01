export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
  profileImage: string | null;
  isAdmin: boolean;
}
