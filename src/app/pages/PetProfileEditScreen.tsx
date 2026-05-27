import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import bgDefault from '../assets/bg_default.png';
import bgBG1 from '../assets/BG_BG01_type1_1.png';
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

/** 아이템 이름 → 로컬 이미지 (백엔드가 imageUrl을 store API에 노출하기 전까지 사용) */
const PET_BG_IMAGE_BY_NAME: Record<string, string> = {
  '기본 배경':   bgDefault,
  '기본 펫 배경': bgDefault,
  '펫 배경 1':   bgBG1,
  '펫 배경 2':   bgLeaf,
};

/** selectedBgId 에 사용할 센티넬: "기본 배경 (아이템 없음)" 상태 */
const DEFAULT_BG_ID = 0;

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
  const image = PET_BG_IMAGE_BY_NAME[item.name];
  const label = item.name;

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
  const [petInfo,         setPetInfo]         = useState<PetInfo | null>(null);
  const [bgItems,         setBgItems]         = useState<BgDisplayItem[]>([]);
  const [selectedBgId,    setSelectedBgId]    = useState<number>(DEFAULT_BG_ID);
  const [defaultBgItemId, setDefaultBgItemId] = useState<number | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);

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

      // 기본 배경 아이템 ID — storeApi.getItems(스토어 목록)와 getMyItems(보유 목록) 양쪽에서 탐색
      // (백엔드가 price=0 아이템을 스토어 목록에 노출하지 않을 수 있으므로 보유 목록도 확인)
      const defaultFromAll = allItems.items.find(i => i.itemType === 'PET_BG' && i.price === 0);
      const defaultFromMy  = myItems.items.find(mi => mi.item.itemType === 'PET_BG' && mi.item.price === 0);
      const foundDefaultId = defaultFromAll?.itemId ?? defaultFromMy?.item.itemId ?? null;
      setDefaultBgItemId(foundDefaultId);

      // 유료 배경 목록: 스토어 목록 + 보유 목록 모두 합산 (스토어에서 내려오지 않는 아이템 대응)
      const bgItemIdsSeen = new Set<number>();
      const bgList: BgDisplayItem[] = [];

      for (const item of allItems.items) {
        if (item.itemType !== 'PET_BG' || item.price === 0) continue;
        bgItemIdsSeen.add(item.itemId);
        const mine = myMap.get(item.itemId);
        bgList.push({
          itemId:   item.itemId,
          itemType: item.itemType,
          name:     item.name,
          owned:    mine !== undefined,
          equipped: mine?.isEquipped ?? false,
        });
      }
      // 보유 중이지만 스토어 목록에 없는 유료 배경 (단종 아이템 등)
      for (const mi of myItems.items) {
        if (mi.item.itemType !== 'PET_BG' || mi.item.price === 0) continue;
        if (bgItemIdsSeen.has(mi.item.itemId)) continue;
        bgList.push({
          itemId:   mi.item.itemId,
          itemType: mi.item.itemType,
          name:     mi.item.name,
          owned:    true,
          equipped: mi.isEquipped,
        });
      }

      setBgItems(bgList);

      // ✅ pet API의 activeBackgroundItemId를 ground truth로 사용
      // bgList에 없는 아이템이더라도 foundDefaultId와 비교해 유료 여부 판단
      const activeBgId = pet.activeBackgroundItemId;
      const isActivePaidBg = activeBgId !== null && activeBgId !== foundDefaultId;
      setSelectedBgId(isActivePaidBg ? activeBgId! : DEFAULT_BG_ID);
    } catch {
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const currentBgName = bgItems.find(b => b.itemId === selectedBgId)?.name ?? null;
  // 미리보기 우선순위:
  // 1) 기본 배경 선택 → bgDefault
  // 2) 유료 배경 선택 → 로컬 이미지 매핑
  // 3) 로컬 이미지 없으면 → petInfo.activeBackgroundUrl (서버 URL) 사용
  // 4) 모두 없으면 → bgDefault
  const previewImage = (() => {
    if (selectedBgId === DEFAULT_BG_ID) return bgDefault;
    if (currentBgName && PET_BG_IMAGE_BY_NAME[currentBgName]) return PET_BG_IMAGE_BY_NAME[currentBgName];
    if (selectedBgId === petInfo?.activeBackgroundItemId && petInfo?.activeBackgroundUrl) {
      return petInfo.activeBackgroundUrl;
    }
    return bgDefault;
  })();

  const handleSave = async () => {
    if (saving) return;

    // ✅ activeBackgroundItemId를 ground truth로 사용
    // bgItems(유료 목록)가 비어있어도 정확히 "현재 기본 배경 여부"를 판단
    const activeBgId = petInfo?.activeBackgroundItemId ?? null;
    const isCurrentlyDefault = activeBgId === null || activeBgId === defaultBgItemId;
    const currentlyEquipped = isCurrentlyDefault ? DEFAULT_BG_ID : activeBgId!;
    if (selectedBgId === currentlyEquipped) {
      navigate(-1);
      return;
    }

    setSaving(true);
    try {
      if (selectedBgId === DEFAULT_BG_ID) {
        // 기본 배경으로 되돌리기: 백엔드의 "기본 펫 배경" 아이템 사용
        if (defaultBgItemId != null) {
          await storeApi.useItem(defaultBgItemId);
        } else {
          // 기본 배경 아이템 ID를 찾지 못한 경우: 저장 불가 안내
          alert('기본 배경 아이템 정보를 찾을 수 없어요. 잠시 후 다시 시도해 주세요.');
          setSaving(false);
          return;
        }
      } else {
        await storeApi.useItem(selectedBgId);
      }
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

  // 항상 선택 가능한 "기본 배경" 카드 (하드코딩)
  const DEFAULT_BG_ITEM: BgDisplayItem = {
    itemId:   DEFAULT_BG_ID,
    itemType: 'PET_BG',
    name:     '기본 배경',
    owned:    true,
    equipped: false,
  };

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
            <img
              src={previewImage ?? bgDefault}
              alt="배경 미리보기"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />

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

            {/* 기본 배경 + 보유 중인 유료 배경 */}
            <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>보유 중</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
              {/* 기본 배경은 항상 첫 번째 */}
              <BgCard
                item={DEFAULT_BG_ITEM}
                selected={selectedBgId === DEFAULT_BG_ID}
                onSelect={() => setSelectedBgId(DEFAULT_BG_ID)}
              />
              {ownedBgItems.map(item => (
                <BgCard
                  key={item.itemId}
                  item={item}
                  selected={selectedBgId === item.itemId}
                  onSelect={() => setSelectedBgId(item.itemId)}
                />
              ))}
            </div>

            {/* 미보유 유료 배경 */}
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
