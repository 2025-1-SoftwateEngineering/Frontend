// ─── Enums ────────────────────────────────────────────────────────────────────

/** authorize: 사용자 권한 (DB enum: ROLE_ADMIN | ROLE_USER) */
export type Authorize = 'ROLE_ADMIN' | 'ROLE_USER';

/** friend_state: 친구 상태 (DB enum: WAITING | ACCEPTED | REJECTED | BLOCKED) */
export type FriendState = 'WAITING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

/** send_repeat: 알림 반복 주기 (DB enum: DAY | WEEK) */
export type Repeat = 'DAY' | 'WEEK';

// ─── Entities ─────────────────────────────────────────────────────────────────

/**
 * member (사용자)
 * DB Table: member
 */
export interface Member {
  /** PK */
  member_id: number;
  /** 아이디로 사용 */
  email: string;
  /** 닉네임 */
  nickname: string;
  /** 권한 (ROLE_ADMIN | ROLE_USER) */
  authorize: Authorize;
  /** 마지막 로그인 시각 */
  login_at: string;
  /** 연속 학습 일수 */
  streak: number;
  /** 보유 코인 */
  coin: number;
  /** 생성 시각 */
  created_at: string;
  /** 수정 시각 */
  updated_at: string;
  /** 탈퇴 시각 (NULL = 미탈퇴, 값 존재 = 탈퇴) */
  deleted_at: string | null;
}

/**
 * member_pet (사용자 애완동물)
 * DB Table: member_pet
 */
export interface MemberPet {
  /** PK */
  member_pet_id: number;
  /** 애완동물 이름 */
  name: string;
  /** 현재 레벨 */
  current_level: number;
  /** 현재 경험치 */
  current_exp: number;
  /** FK → member.member_id */
  member_id: number;
  /** FK → pet.pet_id */
  pet_id: number;
}

/**
 * member_item (사용자 보유 아이템)
 * DB Table: member_item
 */
export interface MemberItem {
  /** PK */
  member_item_id: number;
  /** FK → item.item_id */
  item_id: number;
  /** FK → member.member_id */
  member_id: number;
}

/**
 * alert (알림)
 * DB Table: alert
 */
export interface Alert {
  /** PK */
  alert_id: number;
  /** FCM 토큰 */
  fcm_token: string;
  /** FK → member.member_id */
  member_id: number;
}

/**
 * alert_detail (알림 디테일)
 * DB Table: alert_detail
 */
export interface AlertDetail {
  /** PK */
  alert_detail_id: number;
  /** 보낼 알림 내용 */
  content: string;
  /** 반복 주기 (DAY | WEEK) */
  send_repeat: Repeat;
  /** FK → alert.alert_id */
  alert_id: number;
}

/**
 * friend (친구)
 * DB Table: friend
 */
export interface Friend {
  /** PK */
  friend_id: number;
  /** 친구 상태 (WAITING | ACCEPTED | REJECTED | BLOCKED) */
  friend_state: FriendState;
  /** FK → member.member_id (요청을 보낸 member) */
  from_id: number;
  /** FK → member.member_id (요청을 받은 member) */
  to_id: number;
}
