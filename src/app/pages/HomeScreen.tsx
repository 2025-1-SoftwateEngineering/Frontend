import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Target, Flame, TrendingUp, ChevronRight, PawPrint } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';

const GREETINGS = ['안녕하세요', '반갑습니다', '오늘도 화이팅'];

export function HomeScreen() {
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();

  const greeting = GREETINGS[new Date().getHours() % GREETINGS.length];
  const totalBooks = 3;
  const totalTested = Object.values(progress).filter((p) => p.testResults.length > 0).length;
  const totalLearned = Object.values(progress).reduce((acc, p) => acc + p.learnedWordIds.length, 0);
  const streak = currentUser?.streak ?? 0;
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="flex flex-col pb-4 min-h-full bg-surface-page">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 relative overflow-hidden gradient-brand">
        <div className="absolute -top-7 -right-7 w-[130px] h-[130px] rounded-full bg-white/15" />
        <div className="absolute top-5 right-[60px] w-[60px] h-[60px] rounded-full bg-white/10" />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[13px] text-white/85 mb-1">{dateStr}</p>
          <h1 className="text-[22px] font-bold text-white mb-0.5">
            {greeting}, {currentUser?.nickname}님! 👋
          </h1>
          <p className="text-[13px] text-white/85">
            {currentUser?.authorize === 'ROLE_ADMIN' ? '🛡️ 관리자 모드' : '오늘도 영단어 학습을 시작해 봐요'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-2xl bg-white/25"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
            <span className="text-lg">🔥</span>
          </div>
          <div>
            <p className="text-[11px] text-white/80">이번 주 연속 학습</p>
            <p className="text-base font-bold text-white">{streak}일 / 7일</p>
          </div>
          <div className="flex-1">
            <div className="bg-white/30 rounded-full h-1.5 overflow-hidden mt-0.5">
              <div style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }} className="h-full bg-white rounded-full" />
            </div>
            <p className="text-[10px] text-white/75 mt-0.5 text-right">
              {streak}/7일
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Flame size={20} color="#FF6B35" />, value: `${streak}일`, label: '누적 학습' },
            { icon: <BookOpen size={20} color="#94B9F3" />, value: `${totalLearned}개`, label: '암기 완료' },
            { icon: <Target size={20} color="#776A77" />, value: `${totalTested}/${totalBooks}`, label: '테스트 완료' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-3 flex flex-col items-center gap-1 bg-white shadow-sm"
            >
              {stat.icon}
              <span className="text-lg font-bold text-text-main">{stat.value}</span>
              <span className="text-[11px] text-text-sub">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Quick action */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-base font-bold text-text-main mb-2.5">빠른 시작</h2>
          <button
            onClick={() => navigate('/vocabulary')}
            className="w-full flex items-center gap-4 rounded-2xl p-4 active:scale-98 transition-transform bg-brand-blue shadow-[0_4px_12px_rgba(184,208,250,0.5)]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/40">
              <BookOpen size={24} color="#1c1c1c" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-text-main text-[15px]">단어장 학습하기</p>
              <p className="text-xs text-text-main/65 mt-0.5">TOEIC 핵심 단어 55개 수록</p>
            </div>
            <ChevronRight size={20} color="#1c1c1c" />
          </button>
        </motion.div>

        {/* Today's goal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 bg-white shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} color="#94B9F3" />
            <h3 className="text-[15px] font-bold text-text-main">오늘의 학습 목표</h3>
          </div>
          {[
            { label: '단어 암기하기', done: totalLearned >= 10, count: `${Math.min(totalLearned, 10)}/10` },
            { label: '테스트 완료하기', done: totalTested >= 1, count: `${Math.min(totalTested, 1)}/1` },
          ].map((goal) => (
            <div key={goal.label} className="flex items-center gap-3 py-2">
              <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 ${goal.done ? 'bg-brand-blue' : 'bg-surface-muted'}`}>
                {goal.done && <span className="text-xs">✓</span>}
              </div>
              <span className={`flex-1 text-sm ${goal.done ? 'text-text-sub line-through' : 'text-text-main'}`}>
                {goal.label}
              </span>
              <span className="text-xs text-brand-blue-dark font-semibold">{goal.count}</span>
            </div>
          ))}
        </motion.div>

{/* 애완동물 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => navigate('/pet')}
            className="w-full flex items-center gap-4 rounded-2xl p-4 active:scale-98 transition-transform bg-brand-peach shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/50">
              <PawPrint size={24} color="#776A77" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-text-main text-[15px]">애완동물</p>
              <p className="text-xs text-text-main/65 mt-0.5">나의 학습 친구를 만나보세요</p>
            </div>
            <ChevronRight size={20} color="#776A77" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
