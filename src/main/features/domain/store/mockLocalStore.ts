/**
 * 백엔드 상점에 등록되지 않은 아이템을 로컬(localStorage)에서
 * 구매/장착 상태로 관리하는 임시 유틸리티.
 *
 * 규칙:
 *  - 목 아이템 itemId 는 음수 (-1 ~ -4 등)
 *  - 백엔드에 해당 아이템이 생기면 이 파일을 제거하고 API 로 전환
 */

const OWNED_KEY    = 'vocabuddy_mock_owned_acc';   // number[]
const EQUIPPED_KEY = 'vocabuddy_mock_equipped_acc'; // { itemId: number; imgSrc: string } | null

export interface MockEquippedAcc {
  itemId: number;
  imgSrc: string;
}

function readOwned(): number[] {
  try { return JSON.parse(localStorage.getItem(OWNED_KEY) ?? '[]') as number[]; }
  catch { return []; }
}

export const mockLocalStore = {
  /** 목 악세사리 소유 목록 (itemId 배열) */
  getOwnedAccIds(): number[] {
    return readOwned();
  },

  /** 목 악세사리 구매 (중복 방지) */
  purchaseAcc(itemId: number): void {
    const owned = readOwned();
    if (!owned.includes(itemId)) {
      owned.push(itemId);
      localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
    }
  },

  /** 현재 장착된 목 악세사리 (없으면 null) */
  getEquippedAcc(): MockEquippedAcc | null {
    try { return JSON.parse(localStorage.getItem(EQUIPPED_KEY) ?? 'null') as MockEquippedAcc | null; }
    catch { return null; }
  },

  /** 목 악세사리 장착 */
  equipAcc(itemId: number, imgSrc: string): void {
    localStorage.setItem(EQUIPPED_KEY, JSON.stringify({ itemId, imgSrc }));
  },

  /** 악세사리 해제 */
  unequipAcc(): void {
    localStorage.removeItem(EQUIPPED_KEY);
  },
};
