import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Settings, Shield, Star, BookOpen, Target, Coins } from 'lucide-react';
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
  const { totalExp, level, progress } = useProgress();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const expInLevel = totalExp % 100;
  const expToNext = 100;
  const totalLearned = Object.values(progress).reduce((acc, p) => acc + p.learnedWordIds.length, 0);
  const totalTests = Object.values(progress).reduce((acc, p) => acc + p.testResults.length, 0);
  const bestScore = Object.values(progress)
    .flatMap((p) => p.testResults.map((t) => t.score))
    .reduce((a, b) => Math.max(a, b), 0);

  // 닉네임 이니셜 아바타
  const initial = currentUser.nickname.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/welcome', { replace: true });
  };

  return (
    <div className="flex flex-col pb-6" style={{ minHeight: '100%', background: '#f8f9ff' }}>
      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #B8D0FA 0%, #94B9F3 100%)' }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* 이니셜 아바타 (DB에 profileImage 없음) */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: '#fff', border: '3px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', flexShrink: 0 }}
            >
              <span style={{ fontSize: 28, fontWeight: 700, color: '#94B9F3' }}>{initial}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{currentUser.nickname}</h1>
                {currentUser.authorize === 'ROLE_ADMIN' && (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.25)', fontSize: 11, color: '#fff', fontWeight: 600 }}>
                    <Shield size={10} />
                    관리자
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                Lv.{level} · {getLevelTitle(level)}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="프로필 편집"
            onClick={() => navigate('/profile/edit')}
            className="flex items-center justify-center rounded-xl active:scale-95 transition-transform"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.25)', border: 'none' }}
          >
            <Settings size={18} color="#fff" />
          </button>
        </div>

        {/* streak & coin */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>연속 학습</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{currentUser.streak}일</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: 16 }}>🪙</span>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>보유 코인</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{currentUser.coin.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>경험치</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{expInLevel} / {expToNext} XP</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expInLevel}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ height: '100%', background: '#fff', borderRadius: 99 }}
            />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'right' }}>
            다음 레벨까지 {expToNext - expInLevel} XP
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
              className="rounded-2xl p-3 flex flex-col items-center gap-1"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {stat.icon}
              <span style={{ fontSize: 20, fontWeight: 700, color: '#1c1c1c' }}>{stat.value}</span>
              <span style={{ fontSize: 11, color: '#737373' }}>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c', marginBottom: 12 }}>🏅 업적</p>
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
                className="flex flex-col items-center gap-1"
                style={{ opacity: ach.achieved ? 1 : 0.35, flex: 1 }}
              >
                <div className="rounded-full flex items-center justify-center"
                  style={{ width: 44, height: 44, background: ach.achieved ? '#EDE9BF' : '#f0f0f0', border: ach.achieved ? '2px solid #DDDEA5' : '2px solid transparent' }}>
                  <span style={{ fontSize: 20 }}>{ach.emoji}</span>
                </div>
                <span style={{ fontSize: 10, color: ach.achieved ? '#1c1c1c' : '#737373', textAlign: 'center', lineHeight: 1.3 }}>
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
          className="w-full rounded-2xl py-4 active:scale-95 transition-transform"
          style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700, border: 'none' }}
        >
          프로필 편집하기
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="w-full rounded-2xl py-3.5 active:scale-95 transition-transform"
          style={{ background: '#f3f3f5', color: '#737373', fontSize: 15, fontWeight: 600, border: 'none' }}
        >
          로그아웃
        </motion.button>
      </div>
    </div>
  );
}
