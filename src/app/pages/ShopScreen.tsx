import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';

const CATEGORIES = [
  { label: '미니게임 아이템', icon: '🎮', items: ['힌트 카드', '시간 연장', '단어 공개'] },
  { label: '프로필 배경', icon: '🖼️', items: ['별빛 하늘', '도서관', '카페', '바다'] },
  { label: '프로필 프레임', icon: '✨', items: ['골드 프레임', '쿨 블루', '네온', '플라워'] },
  { label: '아이콘', icon: '🏅', items: ['왕관', '다이아몬드', '불꽃', '번개'] },
];

export function ShopScreen() {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col pb-4 min-h-full bg-surface-page">
      <div className="px-5 pt-14 pb-5 bg-white border-b border-surface-lighter">
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-5 rounded-2xl p-5 flex flex-col items-center gap-2 gradient-brand"
      >
        <span className="text-[40px]">🛍️</span>
        <h2 className="text-lg font-bold text-white">상점 준비 중</h2>
        <p className="text-[13px] text-white/85 text-center leading-[1.7]">
          다양한 아이템이 곧 출시됩니다!<br />
          열심히 학습하며 포인트를 모아두세요 ✨
        </p>
      </motion.div>

      <div className="px-5 mt-5">
        <p className="text-sm font-semibold text-text-main mb-3">준비 중인 카테고리</p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
              className="rounded-2xl p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{cat.icon}</span>
                <span className="font-semibold text-[15px] text-text-main">{cat.label}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-yellow text-brand-purple">
                  준비 중
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {cat.items.map((item) => (
                  <div key={item} className="px-3 py-1.5 rounded-xl bg-surface-muted text-xs text-text-sub">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
