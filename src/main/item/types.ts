/** 백엔드 ItemType enum 값 */
export type ItemType =
  | 'STREAK_FREEZE'
  | 'PET_FOOD'
  | 'PET_WATER'
  | 'CHOICE_TIME_10'
  | 'CHOICE_TIME_30'
  | 'CROSSWORD_HINT_START'
  | 'CROSSWORD_HINT_MIDDLE'
  | 'PET_BG'
  | 'PET_ACCESSORY'
  | 'PROFILE_PHOTO'
  | 'PROFILE_BG';

/**
 * item (아이템)
 * DB Table: item
 */
export interface Item {
  /** PK */
  item_id: number;
  /** 아이템 이름 */
  name: string;
}
