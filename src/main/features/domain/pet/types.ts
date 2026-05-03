/**
 * pet (애완동물)
 * DB Table: pet
 */
export interface Pet {
  /** PK */
  pet_id: number;
  /** 펫 레벨 */
  level: number;
  /** 다음 레벨 업에 필요한 경험치 */
  required_exp: number;
}
