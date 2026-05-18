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
      </div>
    </div>
  );
}
