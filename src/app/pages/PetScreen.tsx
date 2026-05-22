import { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Utensils, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import bgDefault from '../assets/bg_default.png';
import petLv1 from '../assets/pet_lv1.png';

const PET_IMAGES: Record<number, string> = {
  1: petLv1,
};

function getPetImage(level: number): string {
  return PET_IMAGES[level] ?? petLv1;
}

const MAX_HUNGER = 250;
const MAX_THIRST = 100;

const DUMMY_PET = {
  level: 1,
  currentExp: 40,
  requiredExp: 100,
  hunger: 180,
  thirst: 60,
};

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
  const [pet] = useState(DUMMY_PET);
  const [bgImage] = useState<string>(bgDefault);
  const navigate = useNavigate();

  const hungerPct = (pet.hunger / MAX_HUNGER) * 100;
  const thirstPct = (pet.thirst / MAX_THIRST) * 100;
  const expPct    = (pet.currentExp / pet.requiredExp) * 100;

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100dvh - 64px - env(safe-area-inset-bottom, 0px))',
        overflow: 'hidden',
        maxWidth: 430,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* 배경 이미지 */}
      <img
        src={bgImage}
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
                LV.{pet.level}
              </span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              나의 펫
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {pet.currentExp} / {pet.requiredExp} EXP
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
        <motion.img
          src={getPetImage(pet.level)}
          alt={`펫 레벨 ${pet.level}`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 180, height: 180,
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
            imageRendering: 'pixelated',
          }}
        />
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
              label: '물주기',
              icon: <Droplets size={24} color="#fff" />,
              color: 'linear-gradient(135deg, #5BC4FF 0%, #94B9F3 100%)',
              shadow: '0 4px 16px rgba(91,196,255,0.45)',
              count: 5,
            },
            {
              label: '사료주기',
              icon: <Utensils size={24} color="#fff" />,
              color: 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)',
              shadow: '0 4px 16px rgba(255,179,71,0.45)',
              count: 3,
            },
          ].map(({ label, icon, color, shadow, count }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, background: color,
                borderRadius: 16, padding: '16px 0',
                cursor: 'pointer', border: 'none', boxShadow: shadow,
              }}
            >
              {/* 보유 개수 배지 */}
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
            { emoji: '🍖', label: '배고픔', value: pet.hunger, max: MAX_HUNGER, pct: hungerPct, color: getHungerColor(hungerPct), delay: 0.45 },
            { emoji: '💧', label: '목마름', value: pet.thirst, max: MAX_THIRST, pct: thirstPct, color: getThirstColor(thirstPct), delay: 0.55 },
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
