import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';

// ─────────────────────────────────────────────
//  타입 정의
// ─────────────────────────────────────────────

interface ShopItem {
  id: number;
  name: string;
  description: string;
  image: string;       // 이모지 또는 이미지 URL
  price: number;
  badge?: string;      // 'NEW' | 'HOT' | undefined
}

// ─────────────────────────────────────────────
//  판매 아이템 데이터 — 이름·이미지·가격 수정 가능
// ─────────────────────────────────────────────

const STREAK_ITEMS: ShopItem[] = [
  {
    id: 1,
    name: '연속학습 방어권',
    description: '하루 건너뛰어도 연속 기록 유지',
    image: '⚡',
    price: 500,
  },
];

const PROFILE_ITEMS: ShopItem[] = [
  { id: 10, name: '배경1',  description: '프로필 배경', image: '🌌', price: 300 },
  { id: 11, name: '배경2',    description: '프로필 배경', image: '📚', price: 300 },
  { id: 12, name: '프로필사진1', description: '프로필 사진', image: '🖼️', price: 400 },
  { id: 13, name: '프로필사진2',    description: '프로필 사진', image: '🌸', price: 350 },
];

const PET_GROWTH_ITEMS: ShopItem[] = [
  { id: 20, name: '일반 사료',  description: '애완동물 성장 아이템', image: '🍎', price: 150 },
  { id: 21, name: '고급 사료',  description: '애완동물 성장 아이템', image: '🍎', price: 150 },
  { id: 22, name: '물', description: '애완동물 성장 아이템', image: '💊', price: 350 },
];

const PET_STYLE_ITEMS: ShopItem[] = [
  { id: 30, name: '배경1', description: '애완동물 프로필 아이템', image: '🎩', price: 200 },
  { id: 31, name: '배경2',     description: '애완동물 프로필 아이템', image: '👑', price: 500 },
];

const MINIGAME_ITEMS: ShopItem[] = [
  { id: 40, name: '시간 추가 (10초)', description: '미니게임 사지선다', image: '🃏', price: 100 },
  { id: 41, name: '시간 추가 (30초)', description: '미니게임 사지선다', image: '🃏', price: 100 },
  
  { id: 42, name: '시작 스펠링 보기', description: '미니게임 십자말풀이', image: '⏱️', price: 180 },
  { id: 43, name: '랜덤 스펠링 보기', description: '미니게임 십자말풀이', image: '🔍', price: 220 },
];

// ─────────────────────────────────────────────
//  섹션 소제목 컴포넌트
// ─────────────────────────────────────────────

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1c' }}>{label}</span>
      <div className="flex-1 ml-1" style={{ height: 1, background: '#F0EDD6' }} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  배지 컴포넌트
// ─────────────────────────────────────────────

function ItemBadge({ badge }: { badge: string }) {
  const isHot = badge === 'HOT';
  return (
    <span
      className="absolute top-2 right-2 rounded-md px-1.5 py-0.5"
      style={{
        fontSize: 9,
        fontWeight: 700,
        background: isHot ? '#FAEEDA' : '#D6EAF8',
        color: isHot ? '#854F0B' : '#1A5276',
        lineHeight: 1.4,
      }}
    >
      {badge}
    </span>
  );
}

// ─────────────────────────────────────────────
//  아이템 카드 — 그리드용 (세로형)
// ─────────────────────────────────────────────

function ItemCard({ item }: { item: ShopItem }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center rounded-2xl p-3"
      style={{
        background: '#fff',
        border: '1px solid #F8EDD6',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      }}
    >
      {item.badge && <ItemBadge badge={item.badge} />}

      {/* 이미지 영역 */}
      <div
        className="flex items-center justify-center rounded-xl mb-2"
        style={{ width: 54, height: 54, background: '#F8F4E8', fontSize: 28 }}
      >
        {item.image}
      </div>

      {/* 텍스트 */}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#1c1c1c', textAlign: 'center', marginBottom: 2 }}>
        {item.name}
      </p>
      <p style={{ fontSize: 10, color: '#737373', textAlign: 'center', marginBottom: 8, lineHeight: 1.4 }}>
        {item.description}
      </p>

      {/* 가격 */}
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

// ─────────────────────────────────────────────
//  연속학습 파괴 — 와이드 카드 (1칸 중앙)
// ─────────────────────────────────────────────

function StreakItemCard({ item }: { item: ShopItem }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center gap-4 rounded-2xl px-5 py-4"
      style={{
        background: '#fff',
        border: '1px solid #F8EDD6',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      }}
    >
      {item.badge && <ItemBadge badge={item.badge} />}

      {/* 이미지 */}
      <div
        className="flex items-center justify-center rounded-2xl flex-shrink-0"
        style={{ width: 64, height: 64, background: '#FFF3CD', fontSize: 34 }}
      >
        {item.image}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1c', marginBottom: 3 }}>{item.name}</p>
        <p style={{ fontSize: 12, color: '#737373', lineHeight: 1.5, marginBottom: 8 }}>{item.description}</p>
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

// ─────────────────────────────────────────────
//  메인 ShopScreen
// ─────────────────────────────────────────────

export function ShopScreen() {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col" style={{ minHeight: '100%', background: '#f8f9ff' }}>

      {/* ── 헤더 (기존 ShopScreen 헤더 유지) ── */}
      <div
        className="flex-shrink-0 px-5 pt-14 pb-4"
        style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} color="#94B9F3" />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1c1c1c' }}>상점</h1>

          {/* 보유 코인 */}
          {currentUser && (
            <div
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}
            >
              <span style={{ fontSize: 15 }}>🪙</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#B8860B' }}>
                {currentUser.coin.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>
          학습 포인트로 특별한 아이템을 구매하세요
        </p>
      </div>

      {/* ── 스크롤 바디 ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">

        {/* 연속학습 파괴 */}
        <SectionTitle emoji="🔥" label="연속학습 파괴" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {STREAK_ITEMS.map((item) => (
            <StreakItemCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* 프로필 — 2열 2행 */}
        <SectionTitle emoji="👤" label="프로필" />
        <div className="grid grid-cols-2 gap-3">
          {PROFILE_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* 애완동물 성장 — 2열 1행 */}
        <SectionTitle emoji="🐣" label="애완동물 성장" />
        <div className="grid grid-cols-2 gap-3">
          {PET_GROWTH_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* 애완동물 치장 — 2열 1행 */}
        <SectionTitle emoji="🎀" label="애완동물 프로필" />
        <div className="grid grid-cols-2 gap-3">
          {PET_STYLE_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* 미니게임 — 3열 1행 */}
        <SectionTitle emoji="🎮" label="미니게임" />
        <div className="grid grid-cols-2 gap-3">
          {MINIGAME_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
