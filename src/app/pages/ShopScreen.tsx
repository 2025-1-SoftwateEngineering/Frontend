import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { storeApi } from '../../main/features/domain/store/storeApi';
import type { StoreItemInfo } from '../../main/features/domain/store/storeApi';
import type { ItemType } from '../../main/item/types';

// ─── 카테고리 메타 ─────────────────────────────────────────────────────────────

type Category =
  | 'streak'
  | 'pet_grow'
  | 'pet_bg'
  | 'pet_accessory'
  | 'profile_frame'
  | 'profile_bg'
  | 'minigame';

const ITEM_META: Record<ItemType, { emoji: string; category: Category; description: string }> = {
  STREAK_FREEZE:         { emoji: '⚡', category: 'streak',        description: '하루 건너뛰어도 연속 기록 유지' },
  PET_FOOD:              { emoji: '🍖', category: 'pet_grow',      description: '애완동물 배고픔을 줄여줘요' },
  PET_WATER:             { emoji: '💧', category: 'pet_grow',      description: '애완동물 목마름을 줄여줘요' },
  CHOICE_TIME_10:        { emoji: '⏱️', category: 'minigame',      description: '사지선다 시간 +10초' },
  CHOICE_TIME_30:        { emoji: '⏱️', category: 'minigame',      description: '사지선다 시간 +30초' },
  CROSSWORD_HINT_START:  { emoji: '🔍', category: 'minigame',      description: '십자말풀이 시작 스펠링 힌트' },
  CROSSWORD_HINT_MIDDLE: { emoji: '🔍', category: 'minigame',      description: '십자말풀이 중간 스펠링 힌트' },
  PET_BG:                { emoji: '🌿', category: 'pet_bg',        description: '펫 화면 배경 이미지' },
  PET_ACCESSORY:         { emoji: '🎀', category: 'pet_accessory', description: '애완동물 치장 아이템' },
  PROFILE_PHOTO:         { emoji: '🖼️', category: 'profile_frame', description: '프로필 테두리 프레임' },
  PROFILE_BG:            { emoji: '🌌', category: 'profile_bg',    description: '프로필 배경 이미지' },
};

const SECTIONS: { category: Category; emoji: string; label: string }[] = [
  { category: 'streak',        emoji: '🔥', label: '연속학습파괴' },
  { category: 'pet_grow',      emoji: '🐣', label: '애완동물성장' },
  { category: 'pet_bg',        emoji: '🌿', label: '펫배경' },
  { category: 'pet_accessory', emoji: '🎀', label: '펫치장' },
  { category: 'profile_frame', emoji: '🖼️', label: '프로필테두리' },
  { category: 'profile_bg',    emoji: '🌌', label: '프로필배경' },
  { category: 'minigame',      emoji: '🎮', label: '미니게임' },
];

// ─── 표시용 아이템 타입 ────────────────────────────────────────────────────────

interface DisplayItem extends StoreItemInfo {
  ownedCount: number;
}

// ─── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span className="text-[15px] font-bold text-text-main">{label}</span>
      <div className="flex-1 ml-1 h-px bg-surface-lighter" />
    </div>
  );
}

function OwnedBadge({ count }: { count: number }) {
  return (
    <span
      className="absolute top-2 right-2 rounded-md px-1.5 py-0.5"
      style={{ fontSize: 9, fontWeight: 700, background: '#D6EAF8', color: '#1A5276', lineHeight: 1.4 }}
    >
      {count}개 보유
    </span>
  );
}

function ItemCard({
  item,
  onBuy,
  buying,
}: {
  item: DisplayItem;
  onBuy: (item: DisplayItem) => void;
  buying: boolean;
}) {
  const meta = ITEM_META[item.itemType];
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => !buying && onBuy(item)}
      className="relative flex flex-col items-center rounded-2xl p-3 bg-white cursor-pointer"
      style={{ border: '1px solid #F8EDD6', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', opacity: buying ? 0.7 : 1 }}
    >
      {item.ownedCount > 0 && <OwnedBadge count={item.ownedCount} />}
      <div
        className="flex items-center justify-center rounded-xl mb-2"
        style={{ width: 54, height: 54, background: '#F8F4E8', fontSize: 28 }}
      >
        {meta.emoji}
      </div>
      <p className="text-[12px] font-bold text-text-main text-center mb-0.5">{item.name}</p>
      <p className="text-[10px] text-text-sub text-center mb-2 leading-[1.4]">{meta.description}</p>
      <div
        className="flex items-center gap-1 w-full justify-center rounded-xl py-1.5"
        style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}
      >
        <span style={{ fontSize: 12 }}>🪙</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#B8860B' }}>
          {item.price.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

function StreakItemCard({
  item,
  onBuy,
  buying,
}: {
  item: DisplayItem;
  onBuy: (item: DisplayItem) => void;
  buying: boolean;
}) {
  const meta = ITEM_META[item.itemType];
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => !buying && onBuy(item)}
      className="relative flex items-center gap-4 rounded-2xl px-5 py-4 bg-white cursor-pointer"
      style={{ border: '1px solid #F8EDD6', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', opacity: buying ? 0.7 : 1 }}
    >
      {item.ownedCount > 0 && <OwnedBadge count={item.ownedCount} />}
      <div
        className="flex items-center justify-center rounded-2xl flex-shrink-0"
        style={{ width: 64, height: 64, background: '#FFF3CD', fontSize: 34 }}
      >
        {meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-text-main mb-1">{item.name}</p>
        <p className="text-[12px] text-text-sub leading-[1.5] mb-2">{meta.description}</p>
        <div
          className="inline-flex items-center gap-1 rounded-xl px-3 py-1"
          style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}
        >
          <span style={{ fontSize: 13 }}>🪙</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#B8860B' }}>
            {item.price.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 메인 화면 ─────────────────────────────────────────────────────────────────

export function ShopScreen() {
  const { currentUser, updateUser } = useAuth();
  const [items,    setItems]    = useState<DisplayItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [buying,   setBuying]   = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [itemList, myList] = await Promise.all([
        storeApi.getItems(),
        storeApi.getMyItems(),
      ]);

      const countMap = new Map<number, number>();
      for (const mi of (myList.items ?? [])) {
        countMap.set(mi.item.itemId, mi.count);
      }

      setItems(
        (itemList.items ?? [])
          .filter(item => item.price > 0)   // 기본(무료) 아이템은 상점에 표시하지 않음
          .map(item => ({
            ...item,
            ownedCount: countMap.get(item.itemId) ?? 0,
          }))
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleBuy = async (item: DisplayItem) => {
    if (buying) return;
    if (!currentUser || currentUser.coin < item.price) {
      alert('코인이 부족해요!');
      return;
    }
    setBuying(true);
    try {
      const result = await storeApi.purchaseItem(item.itemId);
      await updateUser({ coin: result.remainingCoins });
      setItems(prev =>
        prev.map(i =>
          i.itemId === item.itemId ? { ...i, ownedCount: i.ownedCount + 1 } : i
        )
      );
    } catch {
      alert('구매에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setBuying(false);
    }
  };

  const grouped = (category: Category) =>
    items.filter(i => ITEM_META[i.itemType]?.category === category);

  return (
    <div className="flex flex-col min-h-full bg-surface-page">
      <div className="flex-shrink-0 px-5 pt-4 pb-4 bg-white border-b border-surface-lighter">
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} color="#94B9F3" />
          <h1 className="text-[22px] font-bold text-text-main">상점</h1>
          {currentUser && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E1] border border-[#FFE082]">
              <span className="text-[15px]">🪙</span>
              <span className="text-sm font-bold text-[#B8860B]">
                {currentUser.coin.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <p className="text-[13px] text-text-sub mt-1">학습 포인트로 특별한 아이템을 구매하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading && (
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-text-sub text-sm">로딩 중...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <span className="text-5xl">⚠️</span>
            <p className="text-text-sub text-sm">상점을 불러오는 중 오류가 발생했어요</p>
            <button
              onClick={() => { setError(false); setLoading(true); fetchAll(); }}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-blue text-text-main border-none cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && SECTIONS.map(({ category, emoji, label }) => {
          const sectionItems = grouped(category);
          if (sectionItems.length === 0) return null;

          const isStreak = category === 'streak';
          return (
            <div key={category}>
              <SectionTitle emoji={emoji} label={label} />
              {isStreak ? (
                <div className="flex flex-col gap-3">
                  {sectionItems.map((item, i) => (
                    <motion.div
                      key={item.itemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                    >
                      <StreakItemCard item={item} onBuy={handleBuy} buying={buying} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {sectionItems.map((item, i) => (
                    <motion.div
                      key={item.itemId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                    >
                      <ItemCard item={item} onBuy={handleBuy} buying={buying} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
