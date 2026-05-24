import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import bgDefault from '../assets/BG_BG01_type1_1.png';
import bgLeaf from '../assets/BG_BG07_Leaf_1.png';
import petEgg from '../assets/pet_PE_Egg_1.png';
import petBaby from '../assets/pet_PB_Baby_1.png';
import petGrowing from '../assets/pet_PGI_Growing_1.png';
import petGrown from '../assets/pet_PG_Grown_1.png';
import { petApi } from '../../main/features/domain/pet/petApi';
import type { PetInfo } from '../../main/features/domain/pet/petApi';
import { storeApi } from '../../main/features/domain/store/storeApi';
import type { ItemType } from '../../main/item/types';

// ─── 상수 ───────────────────────────────────────────────────────────────────────

const PET_BG_IMAGE: Partial<Record<ItemType, string>> = {
  PET_BG_1: bgDefault,
  PET_BG_2: bgLeaf,
};

const PET_BG_LABEL: Partial<Record<ItemType, string>> = {
  PET_BG_1: '기본',
  PET_BG_2: '숲속',
};

function getPetImage(stage: string): string {
  if (stage === 'EGG')     return petEgg;
  if (stage === 'BABY')    return petBaby;
  if (stage === 'GROWING') return petGrowing;
  return petGrown;
}

// ─── 타입 ───────────────────────────────────────────────────────────────────────

interface BgDisplayItem {
  itemId:   number;
  itemType: ItemType;
  name:     string;
  owned:    boolean;
  equipped: boolean;
}

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────────

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#f0f0f0', marginLeft: 4 }} />
    </div>
  );
}

function BgCard({
  item,
  selected,
  onSelect,
  locked = false,
}: {
  item: BgDisplayItem;
  selected: boolean;
  onSelect: () => void;
  locked?: boolean;
}) {
  const image = PET_BG_IMAGE[item.itemType];
  const label = PET_BG_LABEL[item.itemType] ?? item.name;

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
      {image ? (
        <img src={image} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: '#B8D0FA' }} />
      )}

      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18 }}>🔒</span>
        </div>
      )}

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

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '4px 0',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{label}</span>
      </div>
    </motion.button>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export function PetProfileEditScreen() {
  const navigate = useNavigate();
  const [petInfo,      setPetInfo]      = useState<PetInfo | null>(null);
  const [bgItems,      setBgItems]      = useState<BgDisplayItem[]>([]);
  const [selectedBgId, setSelectedBgId] = useState<number | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [pet, allItems, myItems] = await Promise.all([
        petApi.getMyPet(),
        storeApi.getItems(),
        storeApi.getMyItems(),
      ]);

      setPetInfo(pet);

      const myMap = new Map<number, { isEquipped: boolean }>();
      for (const mi of myItems.items) {
        myMap.set(mi.item.itemId, { isEquipped: mi.isEquipped });
      }

      const bgList: BgDisplayItem[] = allItems.items
        .filter(i => i.itemType === 'PET_BG_1' || i.itemType === 'PET_BG_2')
        .map(i => {
          const mine = myMap.get(i.itemId);
          return {
            itemId:   i.itemId,
            itemType: i.itemType,
            name:     i.name,
            owned:    mine !== undefined,
            equipped: mine?.isEquipped ?? false,
          };
        });

      setBgItems(bgList);
      const equippedItem = bgList.find(b => b.equipped);
      setSelectedBgId(equippedItem?.itemId ?? null);
    } catch {
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const currentBgType = bgItems.find(b => b.itemId === selectedBgId)?.itemType ?? null;
  const previewImage  = currentBgType ? (PET_BG_IMAGE[currentBgType] ?? null) : null;

  const handleSave = async () => {
    if (saving) return;

    const equippedItem = bgItems.find(b => b.equipped);
    if (selectedBgId === null || selectedBgId === equippedItem?.itemId) {
      navigate(-1);
      return;
    }

    setSaving(true);
    try {
      await storeApi.useItem(selectedBgId);
      navigate(-1);
    } catch {
      alert('저장에 실패했어요. 다시 시도해 주세요.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
        <span style={{ color: '#737373', fontSize: 15 }}>불러오는 중...</span>
      </div>
    );
  }

  const ownedBgItems   = bgItems.filter(b => b.owned);
  const unownedBgItems = bgItems.filter(b => !b.owned);

  return (
    <div style={{ minHeight: '100dvh', background: '#e8e8e8' }}>
      <div
        className="relative flex flex-col"
        style={{ height: '100dvh', background: '#f8f9ff', maxWidth: 430, width: '100%', margin: '0 auto' }}
      >
        {/* 헤더 */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4"
          style={{ paddingTop: 52, paddingBottom: 16, background: '#fff', borderBottom: '1px solid #f0f0f0' }}
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

        {/* 스크롤 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">

          {/* 미리보기 */}
          <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 220 }}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="배경 미리보기"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#B8D0FA' }} />
            )}

            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(to top, #f8f9ff 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 99, padding: '4px 14px',
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>미리보기</span>
            </div>

            {petInfo && (
              <div style={{
                position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{
                  position: 'absolute', bottom: -4, width: 80, height: 12,
                  background: 'rgba(0,0,0,0.15)', borderRadius: '50%', filter: 'blur(5px)',
                }} />
                <motion.img
                  src={getPetImage(petInfo.stage)}
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
            )}
          </div>

          {/* 배경 선택 */}
          <div className="px-5 py-5">
            <SectionTitle emoji="🖼️" label="프로필 배경" />

            {bgItems.length === 0 ? (
              <p style={{ fontSize: 13, color: '#737373', textAlign: 'center', marginTop: 24 }}>
                보유한 펫 배경이 없어요.{'\n'}상점에서 구매해 보세요!
              </p>
            ) : (
              <>
                {ownedBgItems.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>보유 중</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
                      {ownedBgItems.map(item => (
                        <BgCard
                          key={item.itemId}
                          item={item}
                          selected={selectedBgId === item.itemId}
                          onSelect={() => setSelectedBgId(item.itemId)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {unownedBgItems.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>미보유</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {unownedBgItems.map(item => (
                        <BgCard key={item.itemId} item={item} selected={false} onSelect={() => {}} locked />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <div style={{ height: 20 }} />
          </div>
        </div>

        {/* 저장 버튼 */}
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
