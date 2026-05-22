<<<<<<< HEAD
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

=======
import { motion } from 'motion/react';
import { Heart, Zap, Star } from 'lucide-react';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';

const PET_EMOJIS = ['🐣', '🐥', '🐦', '🦅', '🦁'];
const PET_NAMES = ['병아리', '아기 새', '새', '독수리', '사자'];

export function PetScreen() {
  const { totalExp, level } = useProgress();
  const petLevel = Math.min(Math.floor(level / 2) + 1, 5);
  const petEmoji = PET_EMOJIS[petLevel - 1];
  const petName = PET_NAMES[petLevel - 1];

  return (
    <div className="flex flex-col pb-6 min-h-full bg-surface-page">
      <div className="px-5 pt-4 pb-5 bg-white border-b border-surface-lighter">
        <h1 className="text-[22px] font-bold text-text-main">애완동물</h1>
        <p className="text-[13px] text-text-sub mt-0.5">학습할수록 함께 성장해요</p>
      </div>

      <div className="flex flex-col items-center px-5 pt-6 gap-5">
        {/* 펫 카드 */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col items-center gap-3 w-full"
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-[80px]"
          >
            {petEmoji}
          </motion.span>
          <div className="text-center">
            <p className="text-[22px] font-extrabold text-text-main">{petName}</p>
            <p className="text-sm text-text-sub mt-0.5">Lv.{petLevel} 친구</p>
          </div>
          <div className="flex gap-2 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < petLevel ? '#FFD700' : 'none'}
                color={i < petLevel ? '#FFD700' : '#d1d5db'}
              />
            ))}
          </div>
        </motion.div>

        {/* 스탯 */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { icon: <Heart size={18} color="#f87171" />, value: `${petLevel * 20}%`, label: '행복도' },
            { icon: <Zap size={18} color="#FBBF24" />,  value: `${totalExp} XP`,     label: '총 경험치' },
            { icon: <Star size={18} color="#94B9F3" />,  value: `Lv.${petLevel}`,    label: '레벨' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-3 flex flex-col items-center gap-1 bg-white shadow-sm">
              {stat.icon}
              <span className="text-base font-bold text-text-main">{stat.value}</span>
              <span className="text-[11px] text-text-sub">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* 성장 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full rounded-2xl p-4 bg-white shadow-sm"
        >
          <p className="text-sm font-bold text-text-main mb-2">🌱 성장 조건</p>
          <div className="flex flex-col gap-1.5">
            {PET_NAMES.map((name, i) => (
              <div key={name} className={`flex items-center gap-2 text-sm ${i + 1 <= petLevel ? 'text-brand-blue-dark font-semibold' : 'text-text-sub'}`}>
                <span>{i + 1 <= petLevel ? '✓' : '○'}</span>
                <span>{PET_EMOJIS[i]} {name} — Lv.{(i * 2) + 1} 이상</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 업데이트 예정 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full rounded-2xl p-4 bg-brand-peach"
        >
          <p className="text-sm font-bold text-brand-purple mb-1">🚧 업데이트 예정</p>
          <p className="text-[13px] text-text-main leading-[1.7]">
            꾸미기·먹이 주기·친구 방문 기능이 준비 중이에요!<br />
            학습을 계속하면 더 강한 친구로 성장해요.
          </p>
        </motion.div>
>>>>>>> 801b6f54a54d8cf0f212db75a86c481b9fe0d9dc
      </div>
    </div>
  );
}
