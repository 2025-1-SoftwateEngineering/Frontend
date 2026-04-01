export type Role = 'USER' | 'ADMIN';

export interface Member {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  profileBackground: string | null;
  profileFrame: string | null;
  level: number;
  exp: number;
  role: Role;
}
