import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Droplets, Utensils, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import bgDefault    from '../assets/BG_DEFB_Default_1.png';
import bgLeaf       from '../assets/BG_BG07_Leaf_1.png';
import bgMountains  from '../assets/BG_BG08_Mountains_1.png';
import bgRural      from '../assets/BG_BG09_rural_1.png';
import bgUrban      from '../assets/BG_BG10_urban_1.png';
import petEgg from '../assets/pet_PE_Egg_1.png';

/** 스토어 PET_BG 유료 아이템 인덱스 순서 → 로컬 PNG (PetProfileEditScreen의 PET_BG_IMAGES와 동일 순서) */
const PET_BG_PNG = [bgLeaf, bgMountains, bgRural, bgUrban];
import petBaby from '../assets/pet_PB_Baby_1.png';
import petGrowing from '../assets/pet_PGI_Growing_1.png';
import petGrown from '../assets/pet_PG_Grown_1.png';
import type { PetStage } from '../../main/features/domain/pet/types';
import { petApi } from '../../main/features/domain/pet/petApi';
import type { PetInfo } from '../../main/features/domain/pet/petApi';
import { storeApi } from '../../main/features/domain/store/storeApi';
import { mockLocalStore } from '../../main/features/domain/store/mockLocalStore';


const MAX_HUNGER   = 250;
const MAX_THIRST   = 100;
const REQUIRED_EXP = 200;

function getPetImage(stage: PetStage): string {
  if (stage === 'EGG')     return petEgg;
  if (stage === 'BABY')    return petBaby;
  if (stage === 'GROWING') return petGrowing;
  return petGrown;
}

function getHungerColor(pct: number) {
  if (pct > 66) return '#FF6B6B';
  if (pct > 33) return '#FFB347';
  return '#7EC8A4';
}

function getThirstColor(pct: number) {
  if (pct > 66) return '#5BC4FF';
  if (pct > 33) return '#94B9F3';
  return '#C4DFFF';
}

export function PetScreen() {
  const [petInfo,         setPetInfo]         = useState<PetInfo | null>(null);
  const [petFoodItemId,   setPetFoodItemId]   = useState<number | null>(null);
  const [petWaterItemId,  setPetWaterItemId]  = useState<number | null>(null);
  const [foodCount,       setFoodCount]       = useState(0);
  const [waterCount,      setWaterCount]      = useState(0);
  const [bgImgSrc,        setBgImgSrc]        = useState<string>(bgDefault);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  const [actionLoading,   setActionLoading]   = useState(false);
  const navigate  = useNavigate();

  const fetchAll = useCallback(async () => {
    try {
      let pet: PetInfo;
      try {
        pet = await petApi.getMyPet();
      } catch {
        // 펫이 없으면 자동 생성 (최초 접속)
        try {
          pet = await petApi.createPet();
        } catch {
          // createPet도 실패하면 다시 조회 시도
          pet = await petApi.getMyPet();
        }
      }
      setPetInfo(pet);

      // 스토어 실패해도 펫 화면은 표시
      try {
        const [itemList, myList] = await Promise.all([
          storeApi.getItems(),
          storeApi.getMyItems(),
        ]);
        const food  = itemList.items.find(i => i.itemType === 'PET_FOOD');
        const water = itemList.items.find(i => i.itemType === 'PET_WATER');
        if (food)  setPetFoodItemId(food.itemId);
        if (water) setPetWaterItemId(water.itemId);

        // 배경: activeBackgroundUrl 대신 로컬 PNG 매핑 사용 (백엔드 URL 로드 실패 방지)
        const paidBgItems = itemList.items.filter(i => i.itemType === 'PET_BG' && i.price > 0);
        const bgPngMap = new Map<number, string>();
        paidBgItems.forEach((item, i) => { if (PET_BG_PNG[i]) bgPngMap.set(item.itemId, PET_BG_PNG[i]!); });
        const activeBgId = pet.activeBackgroundItemId;
        setBgImgSrc(activeBgId != null ? (bgPngMap.get(activeBgId) ?? bgDefault) : bgDefault);

        // 실제 보유 수량은 my-items에서 가져옴 (pets/me의 foodCount는 0/1만 반환)
        const myFood  = myList.items.find(i => i.item.itemType === 'PET_FOOD');
        const myWater = myList.items.find(i => i.item.itemType === 'PET_WATER');
        setFoodCount(myFood?.count ?? 0);
        setWaterCount(myWater?.count ?? 0);
      } catch { /* 먹이/물 버튼만 비활성화됨 */ }
    } catch {
      setError('펫 정보를 불러올 수 없어요');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleFeed = async () => {
    if (!petFoodItemId || !petInfo || foodCount === 0 || actionLoading) return;
    setActionLoading(true);
    try {
      await storeApi.useItem(petFoodItemId);
      const updated = await petApi.getMyPet();
      setPetInfo(updated);
      setFoodCount(prev => Math.max(0, prev - 1));
    } catch { /* 잔액 부족 등 - 무시 */ }
    finally { setActionLoading(false); }
  };

  const handleWater = async () => {
    if (!petWaterItemId || !petInfo || waterCount === 0 || actionLoading) return;
    setActionLoading(true);
    try {
      await storeApi.useItem(petWaterItemId);
      const updated = await petApi.getMyPet();
      setPetInfo(updated);
      setWaterCount(prev => Math.max(0, prev - 1));
    } catch { /* 잔액 부족 등 - 무시 */ }
    finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
        <span style={{ color: '#fff', fontSize: 16 }}>불러오는 중...</span>
      </div>
    );
  }

  if (error || !petInfo) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#1a1a2e' }}>
        <span style={{ fontSize: 48 }}>⚠️</span>
        <span style={{ color: '#fff', fontSize: 15 }}>펫 정보를 불러올 수 없어요</span>
        <button
          onClick={() => { setError(''); setLoading(true); fetchAll(); }}
          style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: '#5BC4FF', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const hungerPct = (petInfo.hunger / MAX_HUNGER) * 100;
  const thirstPct = (petInfo.thirst / MAX_THIRST) * 100;
  const expPct    = Math.min((petInfo.currentXp / REQUIRED_EXP) * 100, 100);

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        overflow: 'hidden',
        maxWidth: 430,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* 배경 이미지 */}
      <img
        src={bgImgSrc}
        alt="배경"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* 상단 그라데이션 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* 하단 그라데이션 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 280,
        background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* 뒤로가기 버튼 */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute', top: 46, left: 16,
          width: 42, height: 42,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        <ChevronLeft size={24} color="#fff" />
      </motion.button>

      {/* 톱니바퀴 버튼 */}
      <motion.button
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/pet/edit')}
        style={{
          position: 'absolute', top: 46, right: 16,
          width: 42, height: 42,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        <Settings size={22} color="#fff" />
      </motion.button>

      {/* 레벨 + EXP 바 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', top: 54, left: 70, right: 70 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              background: 'rgba(0,0,0,0.55)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              borderRadius: 99,
              padding: '3px 12px',
              backdropFilter: 'blur(6px)',
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#FFE066', letterSpacing: '0.04em' }}>
                LV.{petInfo.level}
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              나의 펫
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {petInfo.currentXp} / {REQUIRED_EXP} EXP
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 99, height: 9, overflow: 'hidden', backdropFilter: 'blur(4px)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FFE066 0%, #FFB347 100%)',
              borderRadius: 99,
              boxShadow: '0 0 8px rgba(255,200,60,0.6)',
            }}
          />
        </div>
      </motion.div>

      {/* 펫 이미지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          position: 'absolute',
          top: 'calc(50% - 90px)',
          left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(-50%)',
        }}
      >
        <div style={{
          position: 'absolute', bottom: -8,
          width: 110, height: 18,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: '50%', filter: 'blur(8px)',
        }} />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: 180, height: 180 }}
        >
          <img
            src={getPetImage(petInfo.stage)}
            alt={`펫 레벨 ${petInfo.level}`}
            style={{
              width: 180, height: 180,
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
              imageRendering: 'pixelated',
            }}
          />
          {/* 백엔드 악세사리 URL → 없으면 로컬 목 장착 아이템으로 폴백 */}
          {(() => {
            const accUrl = petInfo.activeAccessoryUrl
              ?? mockLocalStore.getEquippedAcc()?.imgSrc
              ?? null;
            return accUrl ? (
              <img
                src={accUrl}
                alt="악세사리"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain', pointerEvents: 'none',
                }}
              />
            ) : null;
          })()}
        </motion.div>
      </motion.div>

      {/* 하단 UI */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 16px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>

        {/* 물주기 / 사료주기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: 'flex', gap: 12 }}
        >
          {[
            {
              label:   '물주기',
              icon:    <Droplets size={24} color="#fff" />,
              color:   'linear-gradient(135deg, #5BC4FF 0%, #94B9F3 100%)',
              shadow:  '0 4px 16px rgba(91,196,255,0.45)',
              count:   waterCount,
              onClick: handleWater,
            },
            {
              label:   '사료주기',
              icon:    <Utensils size={24} color="#fff" />,
              color:   'linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)',
              shadow:  '0 4px 16px rgba(255,179,71,0.45)',
              count:   foodCount,
              onClick: handleFeed,
            },
          ].map(({ label, icon, color, shadow, count, onClick }) => (
            <motion.button
              key={label}
              whileTap={{ scale: count > 0 ? 0.96 : 1 }}
              onClick={onClick}
              style={{
                flex: 1, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, background: count > 0 ? color : 'rgba(150,150,150,0.4)',
                borderRadius: 16, padding: '16px 0',
                cursor: count > 0 ? 'pointer' : 'not-allowed',
                border: 'none',
                boxShadow: count > 0 ? shadow : 'none',
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              <div style={{
                position: 'absolute', top: 8, left: 10,
                background: 'rgba(0,0,0,0.28)',
                borderRadius: 99, padding: '2px 8px',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                  {count}개
                </span>
              </div>
              {icon}
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                {label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* 배고픔 / 목마름 패널 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          style={{
            background: 'rgba(20,20,30,0.52)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 20, padding: '16px 18px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}
        >
          {[
            { emoji: '🍖', label: '배고픔', value: petInfo.hunger, max: MAX_HUNGER, pct: hungerPct, color: getHungerColor(hungerPct), delay: 0.45 },
            { emoji: '💧', label: '목마름', value: petInfo.thirst, max: MAX_THIRST, pct: thirstPct, color: getThirstColor(thirstPct), delay: 0.55 },
          ].map(({ emoji, label, value, max, pct, color, delay }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 17 }}>{emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                  {value} / {max}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, height: 9, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.75, ease: 'easeOut', delay }}
                  style={{ height: '100%', background: color, borderRadius: 99, boxShadow: `0 0 6px ${color}88` }}
                />
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
