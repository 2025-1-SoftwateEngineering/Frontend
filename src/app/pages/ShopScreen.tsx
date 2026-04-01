import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  { label: '미니게임 아이템', icon: '🎮', items: ['힌트 카드', '시간 연장', '단어 공개'] },
  { label: '프로필 배경', icon: '🖼️', items: ['별빛 하늘', '도서관', '카페', '바다'] },
  { label: '프로필 프레임', icon: '✨', items: ['골드 프레임', '쿨 블루', '네온', '플라워'] },
  { label: '아이콘', icon: '🏅', items: ['왕관', '다이아몬드', '불꽃', '번개'] },
];

export function ShopScreen() {
  return (
    <div className="flex flex-col pb-4" style={{ minHeight: '100%', background: '#f8f9ff' }}>
      <div className="px-5 pt-14 pb-5" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} color="#94B9F3" />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1c1c1c' }}>상점</h1>
        </div>
        <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>학습 포인트로 특별한 아이템을 구매하세요</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-5 rounded-2xl p-5 flex flex-col items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #B8D0FA, #94B9F3)' }}
      >
        <span style={{ fontSize: 40 }}>🛍️</span>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>상점 준비 중</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 1.7 }}>
          다양한 아이템이 곧 출시됩니다!<br />
          열심히 학습하며 포인트를 모아두세요 ✨
        </p>
      </motion.div>

      <div className="px-5 mt-5">
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1c1c1c', marginBottom: 12 }}>준비 중인 카테고리</p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
              className="rounded-2xl p-4"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#1c1c1c' }}>{cat.label}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full"
                  style={{ fontSize: 11, background: '#DDDEA5', color: '#776A77', fontWeight: 600 }}>
                  준비 중
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {cat.items.map((item) => (
                  <div key={item} className="px-3 py-1.5 rounded-xl"
                    style={{ background: '#f3f3f5', fontSize: 12, color: '#737373' }}>
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
