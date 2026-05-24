import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Settings, Shield, Star, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';

const LEVEL_TITLES: Record<number, string> = {
  1: '씨앗', 2: '새싹', 3: '초보자', 4: '학습자', 5: '탐구자',
  6: '단어꾼', 7: '어휘왕', 8: '마스터', 9: '엑스퍼트', 10: '레전드',
};

function getLevelTitle(level: number) {
  return LEVEL_TITLES[Math.min(level, 10)] ?? '레전드';
}

export function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const { level, progress } = useProgress();
  const navigate = useNavigate();

  if (!currentUser) return null;
  const totalLearned = Object.values(progress).reduce((acc, p) => acc + p.learnedWordIds.length, 0);
  const totalTests = Object.values(progress).reduce((acc, p) => acc + p.testResults.length, 0);
  const bestScore = Object.values(progress)
    .flatMap((p) => p.testResults.map((t) => t.score))
    .reduce((a, b) => Math.max(a, b), 0);

  const initial     = currentUser.nickname.charAt(0).toUpperCase();
  const profilePhoto = currentUser.profileUrl || null;

  const handleLogout = () => {
    logout();
    navigate('/welcome', { replace: true });
  };

  return (
    <div className="flex flex-col pb-6 min-h-full bg-surface-page">
      {/* Header */}
      <div className="relative px-5 pt-14 pb-8 overflow-hidden gradient-brand">
        <div className="absolute -top-10 -right-10 w-[150px] h-[150px] rounded-full bg-white/12" />
        <div className="absolute -bottom-5 -left-5 w-[100px] h-[100px] rounded-full bg-white/8" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-white border-[3px] border-white/70 shadow-md">
              {profilePhoto
                ? <img src={profilePhoto} alt="프로필" className="w-full h-full object-cover" />
                : <span className="text-[28px] font-bold text-brand-blue-dark">{initial}</span>
              }
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{currentUser.nickname}</h1>
                {currentUser.authorize === 'ROLE_ADMIN' && (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/25 text-[11px] text-white font-semibold">
                    <Shield size={10} />
                    관리자
                  </span>
                )}
              </div>
              <p className="text-[13px] text-white/85 mt-0.5">
                Lv.{level} · {getLevelTitle(level)}
              </p>
              <p className="text-xs text-white/70 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="프로필 편집"
            onClick={() => navigate('/profile/edit')}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-95 transition-transform bg-white/25 border-0"
          >
            <Settings size={18} color="#fff" />
          </button>
        </div>

        {/* streak & coin */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-white/20">
            <span className="text-base">🔥</span>
            <div>
              <p className="text-[10px] text-white/75">누적 학습</p>
              <p className="text-[15px] font-bold text-white">{currentUser.streak}일</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-white/20">
            <span className="text-base">🪙</span>
            <div>
              <p className="text-[10px] text-white/75">보유 코인</p>
              <p className="text-[15px] font-bold text-white">{currentUser.coin.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/85 font-semibold">이번 주 연속 학습</span>
            <span className="text-xs text-white/85">{currentUser.streak} / 7일</span>
          </div>
          <div className="bg-white/25 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((currentUser.streak / 7) * 100, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-[11px] text-white/70 mt-1 text-right">
            이번 주 {Math.max(7 - currentUser.streak, 0)}일 남음
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <BookOpen size={20} color="#94B9F3" />, value: `${totalLearned}`, label: '암기 단어' },
            { icon: <Target size={20} color="#776A77" />, value: `${totalTests}`, label: '테스트 횟수' },
            { icon: <Star size={20} color="#DDDEA5" />, value: bestScore > 0 ? `${bestScore}점` : '-', label: '최고 점수' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-3 flex flex-col items-center gap-1 bg-white shadow-sm"
            >
              {stat.icon}
              <span className="text-xl font-bold text-text-main">{stat.value}</span>
              <span className="text-[11px] text-text-sub">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 bg-white shadow-sm"
        >
          <p className="text-sm font-bold text-text-main mb-3">🏅 업적</p>
          <div className="flex gap-3">
            {[
              { emoji: '📚', label: '첫 학습', achieved: totalLearned > 0 },
              { emoji: '✏️', label: '첫 테스트', achieved: totalTests > 0 },
              { emoji: '🔥', label: '연속 5일', achieved: currentUser.streak >= 5 },
              { emoji: '💯', label: '100점 달성', achieved: bestScore >= 100 },
              { emoji: '🌟', label: 'Lv.5 달성', achieved: level >= 5 },
            ].map((ach) => (
              <div
                key={ach.label}
                className={`flex flex-col items-center gap-1 flex-1 ${ach.achieved ? 'opacity-100' : 'opacity-35'}`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${ach.achieved ? 'bg-brand-beige border-2 border-brand-yellow' : 'bg-surface-lighter border-2 border-transparent'}`}>
                  <span className="text-xl">{ach.emoji}</span>
                </div>
                <span className={`text-[10px] text-center leading-[1.3] ${ach.achieved ? 'text-text-main' : 'text-text-sub'}`}>
                  {ach.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('/profile/edit')}
          className="w-full rounded-2xl py-4 active:scale-95 transition-transform bg-brand-blue text-text-main text-base font-bold border-0"
        >
          프로필 편집하기
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="w-full rounded-2xl py-3.5 active:scale-95 transition-transform bg-surface-muted text-text-sub text-[15px] font-semibold border-0"
        >
          로그아웃
        </motion.button>
      </div>
    </div>
  );
}
