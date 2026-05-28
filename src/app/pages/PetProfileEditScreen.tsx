import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import bgDefault    from '../assets/BG_DEFB_Default_1.png';
import bgLeaf       from '../assets/BG_BG07_Leaf.svg';
import bgMountains  from '../assets/BG_BG08_Mountains.svg';
import bgRural      from '../assets/BG_BG09_rural.svg';
import bgUrban      from '../assets/BG_BG10_urban.svg';
// 미리보기 전용 PNG (썸네일은 위 SVG 유지)
import bgLeafPng      from '../assets/BG_BG07_Leaf_1.png';
import bgMountainsPng from '../assets/BG_BG08_Mountains_1.png';
import bgRuralPng     from '../assets/BG_BG09_rural_1.png';
import bgUrbanPng     from '../assets/BG_BG10_urban_1.png';
import accMuffler        from '../assets/clothes_NK01_muffler.svg';
import accPendant        from '../assets/clothes_NK02_pendant.svg';
import accChain          from '../assets/clothes_NK03_Chain.svg';
import accHairband       from '../assets/clothes_HD01_Hairband.svg';
// 실제 PetScreen 적용용 PNG (썸네일은 SVG, 실제 표시는 PNG)
import accMufflerPng     from '../assets/clothes_NK01_muffler_1_PB.png';
import accPendantPng     from '../assets/clothes_NK02_pendant_1_PG.png';
import accChainPng       from '../assets/clothes_NK03_Chain_1_PGI.png';
import accHairbandPng    from '../assets/clothes_HD01_Hairband_1_PGI.png';
import petEgg            from '../assets/pet_PE_Egg_1.png';
import petBaby      from '../assets/pet_PB_Baby_1.png';
import petGrowing   from '../assets/pet_PGI_Growing_1.png';
import petGrown     from '../assets/pet_PG_Grown_1.png';
import { petApi }   from '../../main/features/domain/pet/petApi';
import type { PetInfo } from '../../main/features/domain/pet/petApi';
import { storeApi } from '../../main/features/domain/store/storeApi';
import type { ItemType } from '../../main/item/types';
import { mockLocalStore } from '../../main/features/domain/store/mockLocalStore';

// ─── 이미지 배열 (백엔드 유료 아이템 인덱스 순서와 1:1 매핑) ──────────────────
const PET_BG_IMAGES = [
  { src: bgLeaf,      label: '숲속' },
  { src: bgMountains, label: '산' },
  { src: bgRural,     label: '전원' },
  { src: bgUrban,     label: '도시' },
];

const PET_ACC_IMAGES = [
  { src: accMuffler,  label: '목도리' },
  { src: accPendant,  label: '펜던트' },
  { src: accChain,    label: '체인' },
  { src: accHairband, label: '헤어밴드' },
];

/** 미리보기 전용 PNG (인덱스가 PET_ACC_IMAGES / PET_BG_IMAGES와 1:1 대응) */
const PET_ACC_PNG = [accMufflerPng, accPendantPng, accChainPng, accHairbandPng];
const PET_BG_PNG  = [bgLeafPng, bgMountainsPng, bgRuralPng, bgUrbanPng];

/** 기본 배경 / 악세사리 없음 센티넬 (실제 itemId는 0이 없음) */
const DEFAULT_BG_ID  = 0;
const DEFAULT_ACC_ID = 0;

function getPetImage(stage: string): string {
  if (stage === 'EGG')     return petEgg;
  if (stage === 'BABY')    return petBaby;
  if (stage === 'GROWING') return petGrowing;
  return petGrown;
}

// ─── 타입 ─────────────────────────────────────────────────────────────────────

interface DisplayItem {
  itemId:   number;
  itemType: ItemType;
  name:     string;
  owned:    boolean;
  equipped: boolean;
  img:      string;
  label:    string;
}

// ─── 서브 컴포넌트 ─────────────────────────────────────────────────────────────

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#f0f0f0', marginLeft: 4 }} />
    </div>
  );
}

function ItemCard({
  img, label, selected, locked, onSelect,
}: {
  img?: string; label: string; selected: boolean; locked?: boolean; onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={locked ? {} : { scale: 0.95 }}
      onClick={onSelect}
      style={{
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        aspectRatio: '1',
        border: selected ? '2.5px solid #94B9F3' : '2px solid transparent',
        cursor: locked ? 'not-allowed' : 'pointer',
        background: 'none', padding: 0,
        boxShadow: selected ? '0 0 0 3px rgba(148,185,243,0.3)' : '0 2px 6px rgba(0,0,0,0.08)',
        opacity: locked ? 0.55 : 1,
      }}
    >
      {img ? (
        <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        /* 없음 카드 */
        <div style={{
          width: '100%', height: '100%',
          background: '#ebebee',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 20, color: '#aaa' }}>✕</span>
        </div>
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

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function PetProfileEditScreen() {
  const navigate = useNavigate();
  const [petInfo,          setPetInfo]          = useState<PetInfo | null>(null);

  // 배경
  const [bgItems,          setBgItems]          = useState<DisplayItem[]>([]);
  const [selectedBgId,     setSelectedBgId]     = useState<number>(DEFAULT_BG_ID);
  const [defaultBgItemId,  setDefaultBgItemId]  = useState<number | null>(null);

  // 악세사리
  const [accItems,         setAccItems]         = useState<DisplayItem[]>([]);
  const [selectedAccId,    setSelectedAccId]    = useState<number>(DEFAULT_ACC_ID);
  const [defaultAccItemId, setDefaultAccItemId] = useState<number | null>(null);

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

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

      // ─── 배경 ───────────────────────────────────────────────────────────────
      // ※ defaultBgItemId는 유저가 실제 보유한 경우에만 세팅 (카탈로그에만 있는 아이템을 useItem 하면 STORE404_2)
      const defaultBgMy  = myItems.items.find(mi => mi.item.itemType === 'PET_BG' && mi.item.price === 0);
      const foundDefaultBgId = defaultBgMy?.item.itemId ?? null;
      setDefaultBgItemId(foundDefaultBgId);

      const paidBgItems  = allItems.items.filter(i => i.itemType === 'PET_BG' && i.price > 0);
      const bgSeen       = new Set<number>();
      const bgList: DisplayItem[] = [];

      paidBgItems.forEach((item, i) => {
        bgSeen.add(item.itemId);
        const mine = myMap.get(item.itemId);
        bgList.push({
          itemId: item.itemId, itemType: item.itemType, name: item.name,
          owned: mine !== undefined, equipped: mine?.isEquipped ?? false,
          img:   PET_BG_IMAGES[i]?.src   ?? bgDefault,
          label: PET_BG_IMAGES[i]?.label ?? item.name,
        });
      });
      // 보유 중이지만 스토어에 없는 아이템
      for (const mi of myItems.items) {
        if (mi.item.itemType !== 'PET_BG' || mi.item.price === 0) continue;
        if (bgSeen.has(mi.item.itemId)) continue;
        const i = bgList.length;
        bgList.push({
          itemId: mi.item.itemId, itemType: mi.item.itemType, name: mi.item.name,
          owned: true, equipped: mi.isEquipped,
          img:   PET_BG_IMAGES[i]?.src   ?? bgDefault,
          label: PET_BG_IMAGES[i]?.label ?? mi.item.name,
        });
      }
      setBgItems(bgList);

      // ─── 악세사리 ────────────────────────────────────────────────────────────
      // ※ defaultAccItemId도 보유 여부 기반으로만 세팅
      const defaultAccMy  = myItems.items.find(mi => mi.item.itemType === 'PET_ACCESSORY' && mi.item.price === 0);
      const foundDefaultAccId = defaultAccMy?.item.itemId ?? null;
      setDefaultAccItemId(foundDefaultAccId);

      const paidAccItems  = allItems.items.filter(i => i.itemType === 'PET_ACCESSORY' && i.price > 0);
      const accSeen       = new Set<number>();
      const accList: DisplayItem[] = [];

      paidAccItems.forEach((item, i) => {
        accSeen.add(item.itemId);
        const mine = myMap.get(item.itemId);
        accList.push({
          itemId: item.itemId, itemType: item.itemType, name: item.name,
          owned: mine !== undefined, equipped: mine?.isEquipped ?? false,
          img:   PET_ACC_IMAGES[i]?.src   ?? '',
          label: PET_ACC_IMAGES[i]?.label ?? item.name,
        });
      });
      for (const mi of myItems.items) {
        if (mi.item.itemType !== 'PET_ACCESSORY' || mi.item.price === 0) continue;
        if (accSeen.has(mi.item.itemId)) continue;
        const i = accList.length;
        accList.push({
          itemId: mi.item.itemId, itemType: mi.item.itemType, name: mi.item.name,
          owned: true, equipped: mi.isEquipped,
          img:   PET_ACC_IMAGES[i]?.src   ?? '',
          label: PET_ACC_IMAGES[i]?.label ?? mi.item.name,
        });
      }

      // ── 백엔드에 없는 목 악세사리: 로컬 구매 내역 반영 ──────────────────────────
      let initMockAccId: number | null = null;
      if (paidAccItems.length === 0) {
        const ownedMockIds = new Set(mockLocalStore.getOwnedAccIds());
        const MOCK_NAMES  = ['목도리', '펜던트', '체인', '헤어밴드'];
        const equippedMock = mockLocalStore.getEquippedAcc();
        for (let i = 0; i < PET_ACC_IMAGES.length; i++) {
          const mockId = -(i + 1);
          accList.push({
            itemId: mockId,
            itemType: 'PET_ACCESSORY' as ItemType,
            name: MOCK_NAMES[i] ?? `악세사리 ${i + 1}`,
            owned: ownedMockIds.has(mockId),
            equipped: equippedMock?.itemId === mockId,
            img:   PET_ACC_IMAGES[i]?.src   ?? '',
            label: PET_ACC_IMAGES[i]?.label ?? '',
          });
        }
        // 로컬 장착 아이템이 있으면 기록 (아래 setSelectedAccId에서 사용)
        if (equippedMock != null && equippedMock.itemId < 0) {
          initMockAccId = equippedMock.itemId;
        }
      }

      setAccItems(accList);

      // ─── 초기 선택값 ──────────────────────────────────────────────────────────
      const activeBgId  = pet.activeBackgroundItemId;
      const isDefaultBg = activeBgId === null || activeBgId === foundDefaultBgId;
      setSelectedBgId(isDefaultBg ? DEFAULT_BG_ID : activeBgId!);

      // 악세사리: 백엔드 활성 아이템 → 로컬 목 장착 → 없음 순으로 결정
      setSelectedAccId(pet.activeAccessoryItemId ?? initMockAccId ?? DEFAULT_ACC_ID);

    } catch {
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── 미리보기 ──────────────────────────────────────────────────────────────
  const previewBgImg = (() => {
    if (selectedBgId === DEFAULT_BG_ID) return bgDefault;
    const idx = bgItems.findIndex(b => b.itemId === selectedBgId);
    if (idx >= 0 && PET_BG_PNG[idx]) return PET_BG_PNG[idx]!;
    if (selectedBgId === petInfo?.activeBackgroundItemId && petInfo?.activeBackgroundUrl)
      return petInfo.activeBackgroundUrl;
    return bgDefault;
  })();

  const previewAccImg = (() => {
    if (selectedAccId === DEFAULT_ACC_ID) return null;
    const idx = accItems.findIndex(a => a.itemId === selectedAccId);
    if (idx >= 0 && PET_ACC_PNG[idx]) return PET_ACC_PNG[idx]!;
    if (selectedAccId === petInfo?.activeAccessoryItemId && petInfo?.activeAccessoryUrl)
      return petInfo.activeAccessoryUrl;
    return null;
  })();

  // ─── 저장 ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return;

    const activeBgId           = petInfo?.activeBackgroundItemId ?? null;
    const isCurrentlyDefaultBg = activeBgId === null || activeBgId === defaultBgItemId;
    const currentlyEquippedBg  = isCurrentlyDefaultBg ? DEFAULT_BG_ID : activeBgId!;
    // 악세사리: 백엔드 활성 → 로컬 목 장착 → 없음 순으로 현재 상태 판단
    const mockEquipped = mockLocalStore.getEquippedAcc();
    const currentlyEquippedAcc = petInfo?.activeAccessoryItemId
      ?? (mockEquipped != null ? mockEquipped.itemId : DEFAULT_ACC_ID);

    const bgChanged  = selectedBgId  !== currentlyEquippedBg;
    const accChanged = selectedAccId !== currentlyEquippedAcc;

    if (!bgChanged && !accChanged) { navigate(-1); return; }

    setSaving(true);
    try {
      if (bgChanged) {
        if (selectedBgId === DEFAULT_BG_ID) {
          if (defaultBgItemId != null) await storeApi.useItem(defaultBgItemId);
          else { alert('기본 배경 아이템 정보를 찾을 수 없어요.'); setSaving(false); return; }
        } else {
          await storeApi.useItem(selectedBgId);
        }
      }
      if (accChanged) {
        if (selectedAccId === DEFAULT_ACC_ID) {
          // 악세사리 없음
          // 실제 백엔드 악세사리가 장착된 경우에만 API 호출 (mock 전용일 땐 스킵)
          const hasRealAccItems = accItems.some(a => a.itemId > 0);
          if (hasRealAccItems && defaultAccItemId != null) await storeApi.useItem(defaultAccItemId);
          mockLocalStore.unequipAcc();
        } else if (selectedAccId < 0) {
          // 목 아이템 장착 (로컬만) — PetScreen에서 PNG로 표시되도록 PNG src 저장
          const idx = -(selectedAccId + 1); // -1→0, -2→1, -3→2, -4→3
          const pngSrc = PET_ACC_PNG[idx] ?? accItems.find(a => a.itemId === selectedAccId)?.img ?? '';
          if (pngSrc) mockLocalStore.equipAcc(selectedAccId, pngSrc);
        } else {
          await storeApi.useItem(selectedAccId);
          mockLocalStore.unequipAcc(); // 실제 아이템 장착 시 로컬 목 해제
        }
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

  const ownedBgItems    = bgItems.filter(b => b.owned);
  const unownedBgItems  = bgItems.filter(b => !b.owned);
  const ownedAccItems   = accItems.filter(a => a.owned);
  const unownedAccItems = accItems.filter(a => !a.owned);

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
              src={previewBgImg}
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
                {/* 펫 + 악세사리 오버레이 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'relative', width: 120, height: 120 }}
                >
                  <img
                    src={getPetImage(petInfo.stage)}
                    alt="펫 미리보기"
                    style={{
                      width: 120, height: 120, objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
                      imageRendering: 'pixelated',
                    }}
                  />
                  {previewAccImg && (
                    <img
                      src={previewAccImg}
                      alt="악세사리 미리보기"
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'contain', pointerEvents: 'none',
                      }}
                    />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* 배경 / 악세사리 선택 */}
          <div className="px-5 py-5">

            {/* ── 배경 ── */}
            <SectionTitle emoji="🖼️" label="펫 배경" />

            <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>보유 중</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
              <ItemCard
                img={bgDefault} label="기본 배경"
                selected={selectedBgId === DEFAULT_BG_ID}
                onSelect={() => setSelectedBgId(DEFAULT_BG_ID)}
              />
              {ownedBgItems.map(item => (
                <ItemCard
                  key={item.itemId} img={item.img} label={item.label}
                  selected={selectedBgId === item.itemId}
                  onSelect={() => setSelectedBgId(item.itemId)}
                />
              ))}
            </div>

            {unownedBgItems.length > 0 && (
              <>
                <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>미보유</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
                  {unownedBgItems.map(item => (
                    <ItemCard key={item.itemId} img={item.img} label={item.label}
                      selected={false} locked onSelect={() => {}} />
                  ))}
                </div>
              </>
            )}

            <div style={{ height: 8 }} />

            {/* ── 악세사리 ── */}
            <SectionTitle emoji="🎀" label="악세사리" />

            <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>보유 중</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
              {/* 없음 카드 */}
              <ItemCard
                label="없음"
                selected={selectedAccId === DEFAULT_ACC_ID}
                onSelect={() => setSelectedAccId(DEFAULT_ACC_ID)}
              />
              {ownedAccItems.map(item => (
                <ItemCard
                  key={item.itemId} img={item.img} label={item.label}
                  selected={selectedAccId === item.itemId}
                  onSelect={() => setSelectedAccId(item.itemId)}
                />
              ))}
            </div>

            {unownedAccItems.length > 0 && (
              <>
                <p style={{ fontSize: 12, color: '#737373', marginBottom: 10 }}>미보유</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {unownedAccItems.map(item => (
                    <ItemCard key={item.itemId} img={item.img} label={item.label}
                      selected={false} locked onSelect={() => {}} />
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
              width: '100%', padding: '16px 0', borderRadius: 16, border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              background: saving ? '#c8ddf8' : '#B8D0FA',
              color: '#1c1c1c', fontSize: 16, fontWeight: 700,
            }}
          >
            {saving ? '저장 중...' : '저장하기'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
