import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import bgDefault from '../assets/bg_default.png';
import petLv1 from '../assets/pet_lv1.png';

// ─────────────────────────────────────────────
//  타입
// ─────────────────────────────────────────────

interface BgItem {
  id: number;
  label: string;
  color: string;   // 미리보기 색상 (이미지 없을 때)
  image?: string;  // 실제 배경 이미지 (가변)
  owned: boolean;
}

interface AccessoryItem {
  id: number;
  label: string;
  emoji: string;
  owned: boolean;
}

// ─────────────────────────────────────────────
//  더미 데이터 (기능 구현 시 API로 교체)
// ─────────────────────────────────────────────

const BG_ITEMS: BgItem[] = [
  { id: 0,  label: '기본',    color: '#B8D0FA', image: bgDefault, owned: true  },
  { id: 1,  label: '숲속',    color: '#7EC8A4',                   owned: true  },
  { id: 2,  label: '석양',    color: '#FFB347',                   owned: false },
  { id: 3,  label: '밤하늘',  color: '#3B4A7A',                   owned: false },
  { id: 4,  label: '설원',    color: '#C4DFFF',                   owned: false },
  { id: 5,  label: '해변',    color: '#5BC4FF',                   owned: false },
];

const ACCESSORY_ITEMS: AccessoryItem[] = [
  { id: 0,  label: '없음',      emoji: '✕',  owned: true  },
  { id: 1,  label: '왕관',      emoji: '👑', owned: true  },
  { id: 2,  label: '리본',      emoji: '🎀', owned: true  },
  { id: 3,  label: '안경',      emoji: '🕶️', owned: false },
  { id: 4,  label: '모자',      emoji: '🎩', owned: false },
  { id: 5,  label: '목도리',    emoji: '🧣', owned: false },
  { id: 6,  label: '날개',      emoji: '🪽', owned: false },
  { id: 7,  label: '별 헤어핀', emoji: '⭐', owned: false },
];

const TABS = ['프로필 배경', '악세서리'] as const;
type Tab = typeof TABS[number];

// ─────────────────────────────────────────────
//  서브 컴포넌트
// ─────────────────────────────────────────────

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1c' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#f0f0f0', marginLeft: 4 }} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────

export function PetProfileEditScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('프로필 배경');
  const [selectedBg, setSelectedBg] = useState<number>(0);
  const [selectedAccessory, setSelectedAccessory] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const currentBg = BG_ITEMS.find(b => b.id === selectedBg) ?? BG_ITEMS[0];

  const handleSave = async () => {
    setSaving(true);
    // TODO: API 저장 연결
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#e8e8e8' }}>
      <div
        className="relative flex flex-col"
        style={{ height: '100dvh', background: '#f8f9ff', maxWidth: 430, width: '100%', margin: '0 auto' }}
      >
      {/* ── 헤더 ── */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4"
        style={{
          paddingTop: 52,
          paddingBottom: 16,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ color: '#737373', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={26} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>펫 꾸미기</h1>
      </div>

      {/* ── 스크롤 컨텐츠 ── */}
      <div className="flex-1 overflow-y-auto">

        {/* 미리보기 영역 */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ height: 220 }}
        >
          {/* 배경 */}
          {currentBg.image ? (
            <img
              src={currentBg.image}
              alt="배경 미리보기"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: currentBg.color }} />
          )}

          {/* 어두운 그라데이션 하단 */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to top, #f8f9ff 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* 미리보기 레이블 */}
          <div
            style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 99,
              padding: '4px 14px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>미리보기</span>
          </div>

          {/* 펫 이미지 */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            {/* 악세서리 이모지 */}
            {selectedAccessory !== 0 && (
              <motion.span
                key={selectedAccessory}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ fontSize: 28, marginBottom: -6, zIndex: 1 }}
              >
                {ACCESSORY_ITEMS.find(a => a.id === selectedAccessory)?.emoji}
              </motion.span>
            )}
            {/* 그림자 */}
            <div style={{
              position: 'absolute', bottom: -4, width: 80, height: 12,
              background: 'rgba(0,0,0,0.15)', borderRadius: '50%', filter: 'blur(5px)',
            }} />
            <motion.img
              src={petLv1}
              alt="펫 미리보기"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 120, height: 120,
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>

        {/* ── 탭 ── */}
        <div
          className="flex-shrink-0 flex px-5 gap-2"
          style={{ paddingTop: 8, paddingBottom: 4 }}
        >
          {TABS.map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.2s',
                background: activeTab === tab ? '#B8D0FA' : '#fff',
                color: activeTab === tab ? '#1c1c1c' : '#737373',
                boxShadow: activeTab === tab
                  ? '0 2px 8px rgba(184,208,250,0.5)'
                  : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* ── 탭 컨텐츠 ── */}
        <div className="px-5 py-5">

          {/* 프로필 배경 탭 */}
          {activeTab === '프로필 배경' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SectionTitle emoji="🖼️" label="보유 중" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {BG_ITEMS.filter(b => b.owned).map((item) => (
                  <BgCard
                    key={item.id}
                    item={item}
                    selected={selectedBg === item.id}
                    onSelect={() => setSelectedBg(item.id)}
                  />
                ))}
              </div>

              <SectionTitle emoji="🔒" label="미보유" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                }}
              >
                {BG_ITEMS.filter(b => !b.owned).map((item) => (
                  <BgCard
                    key={item.id}
                    item={item}
                    selected={false}
                    onSelect={() => {}}
                    locked
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* 악세서리 탭 */}
          {activeTab === '악세서리' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SectionTitle emoji="✨" label="보유 중" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {ACCESSORY_ITEMS.filter(a => a.owned).map((item) => (
                  <AccessoryCard
                    key={item.id}
                    item={item}
                    selected={selectedAccessory === item.id}
                    onSelect={() => setSelectedAccessory(item.id)}
                  />
                ))}
              </div>

              <SectionTitle emoji="🔒" label="미보유" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                }}
              >
                {ACCESSORY_ITEMS.filter(a => !a.owned).map((item) => (
                  <AccessoryCard
                    key={item.id}
                    item={item}
                    selected={false}
                    onSelect={() => {}}
                    locked
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div style={{ height: 20 }} />
        </div>
      </div>

      {/* ── 저장 버튼 ── */}
      <div
        className="flex-shrink-0 px-5 py-4"
        style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 16,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            background: saving ? '#c8ddf8' : '#B8D0FA',
            color: '#1c1c1c',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {saving ? '저장 중...' : '저장하기'}
        </motion.button>
      </div>
    </div>
    </div>
  );
}
// ─────────────────────────────────────────────

function BgCard({
  item,
  selected,
  onSelect,
  locked = false,
}: {
  item: BgItem;
  selected: boolean;
  onSelect: () => void;
  locked?: boolean;
}) {
  return (
    <motion.button
      whileTap={locked ? {} : { scale: 0.95 }}
      onClick={onSelect}
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        aspectRatio: '1',
        border: selected ? '2.5px solid #94B9F3' : '2px solid transparent',
        cursor: locked ? 'not-allowed' : 'pointer',
        background: 'none',
        padding: 0,
        boxShadow: selected
          ? '0 0 0 3px rgba(148,185,243,0.3)'
          : '0 2px 6px rgba(0,0,0,0.08)',
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* 배경 색/이미지 */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: item.color }} />
      )}

      {/* 잠금 오버레이 */}
      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18 }}>🔒</span>
        </div>
      )}

      {/* 선택 체크 */}
      {selected && (
        <div style={{
          position: 'absolute', top: 5, right: 5,
          width: 20, height: 20, borderRadius: '50%',
          background: '#94B9F3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={12} color="#fff" strokeWidth={3} />
        </div>
      )}

      {/* 레이블 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '4px 0',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{item.label}</span>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────
//  악세서리 카드
// ─────────────────────────────────────────────

function AccessoryCard({
  item,
  selected,
  onSelect,
  locked = false,
}: {
  item: AccessoryItem;
  selected: boolean;
  onSelect: () => void;
  locked?: boolean;
}) {
  return (
    <motion.button
      whileTap={locked ? {} : { scale: 0.92 }}
      onClick={onSelect}
      style={{
        position: 'relative',
        borderRadius: 14,
        padding: '12px 4px 8px',
        border: selected ? '2.5px solid #94B9F3' : '2px solid #f0f0f0',
        cursor: locked ? 'not-allowed' : 'pointer',
        background: selected ? 'rgba(184,208,250,0.15)' : '#fff',
        boxShadow: selected
          ? '0 0 0 3px rgba(148,185,243,0.25)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <span style={{ fontSize: item.id === 0 ? 16 : 24, lineHeight: 1 }}>
        {item.emoji}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#737373' }}>
        {item.label}
      </span>

      {/* 잠금 */}
      {locked && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14 }}>🔒</span>
        </div>
      )}

      {/* 선택 체크 */}
      {selected && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          width: 16, height: 16, borderRadius: '50%',
          background: '#94B9F3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={10} color="#fff" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
}
