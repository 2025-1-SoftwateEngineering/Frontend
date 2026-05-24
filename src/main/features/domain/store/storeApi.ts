import { apiFetch, API_URL } from '../../../config/apiConfig';
import type { ItemType } from '../../../item/types';

// ─── 응답 타입 ─────────────────────────────────────────────────────────────────

export interface StoreItemInfo {
  itemId:   number;
  name:     string;
  price:    number;
  itemType: ItemType;
}

export interface ItemListResult {
  items:      StoreItemInfo[];
  totalCount: number;
}

export interface MyItemInfo {
  item:       StoreItemInfo;
  count:      number;
  isEquipped: boolean;
}

export interface MyItemListResult {
  items:      MyItemInfo[];
  totalCount: number;
}

export interface PurchaseResult {
  remainingCoins: number;
  purchasedItem:  StoreItemInfo;
}

export interface UseResult {
  itemName:       string;
  remainingCount: number;
  hintResult:     { letter: string; verticalStartPoint: number; horizontalStartPoint: number } | null;
}

// ─── API ───────────────────────────────────────────────────────────────────────

export const storeApi = {
  /** GET /api/v1/store/items */
  getItems: async (): Promise<ItemListResult> => {
    const res = await apiFetch<ItemListResult>('/store/items', {}, API_URL);
    return res.result!;
  },

  /** GET /api/v1/store/my-items */
  getMyItems: async (): Promise<MyItemListResult> => {
    const res = await apiFetch<MyItemListResult>('/store/my-items', {}, API_URL);
    return res.result!;
  },

  /** POST /api/v1/store/items/{itemId}/purchase */
  purchaseItem: async (itemId: number): Promise<PurchaseResult> => {
    const res = await apiFetch<PurchaseResult>(`/store/items/${itemId}/purchase`, {
      method: 'POST',
    }, API_URL);
    return res.result!;
  },

  /** POST /api/v1/store/items/{itemId}/use */
  useItem: async (itemId: number, contextId?: number): Promise<UseResult> => {
    const res = await apiFetch<UseResult>(`/store/items/${itemId}/use`, {
      method: 'POST',
      ...(contextId != null && { body: JSON.stringify({ contextId }) }),
    }, API_URL);
    return res.result!;
  },
};
