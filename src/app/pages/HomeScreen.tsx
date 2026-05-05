import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Target, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { useStreak } from '../../main/features/domain/streak/StreakContext';

const GREETINGS = ['안녕하세요', '반갑습니다', '오늘도 화이팅'];

export function HomeScreen() {
  const { currentUser } = useAuth();
  const { totalExp, level, progress } = useProgress();
  const navigate = useNavigate();

  const { streakData } = useStreak();
  const greeting = GREETINGS[new Date().getHours() % GREETINGS.length];
  const expInLevel = totalExp % 100;
  const totalBooks = 3;
  const totalTested = Object.values(progress).filter((p) => p.testResults.length > 0).length;
  const totalLearned = Object.values(progress).reduce((acc, p) => acc + p.learnedWordIds.length, 0);
  const streak = streakData.currentStreak;
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="flex flex-col pb-4" style={{ minHeight: '100%', background: '#f8f9ff' }}>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #B8D0FA 0%, #94B9F3 100%)' }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', top: 20, right: 60, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>{dateStr}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
            {greeting}, {currentUser?.nickname}님! 👋
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            {currentUser?.role === 'ADMIN' ? '🛡️ 관리자 모드' : '오늘도 영단어 학습을 시작해 봐요'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.25)' }}
        >
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 40, height: 40, background: '#fff' }}>
            <span style={{ fontSize: 18 }}>⭐</span>
          </div>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>현재 레벨</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Lv.{level} · {totalExp} XP</p>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 99, height: 6, overflow: 'hidden', marginTop: 2 }}>
              <div style={{ width: `${expInLevel}%`, height: '100%', background: '#fff', borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, textAlign: 'right' }}>
              {expInLevel}/100 XP
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Flame size={20} color="#FF6B35" />, value: `${streak}일`, label: '연속 학습' },
            { icon: <BookOpen size={20} color="#94B9F3" />, value: `${totalLearned}개`, label: '암기 완료' },
            { icon: <Target size={20} color="#776A77" />, value: `${totalTested}/${totalBooks}`, label: '테스트 완료' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-3 flex flex-col items-center gap-1"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {stat.icon}
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>{stat.value}</span>
              <span style={{ fontSize: 11, color: '#737373' }}>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Streak 위젯 */}
        {(() => {
          const todayStr = (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          })();
          const todayDone = streakData.lastStudyDate === todayStr;
          const nextMilestone = Math.ceil((streak + 1) / 7) * 7;
          const milestoneProgress = streak % 7;
          return (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-4"
              style={{
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: !todayDone ? '2px solid #DDDEA5' : '2px solid transparent',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame size={20} color="#FF6B35" />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1c' }}>
                    {streak > 0 ? `${streak}일 연속 학습 중!` : '오늘 첫 학습을 시작해보세요!'}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: 11, fontWeight: 600,
                    background: todayDone ? '#B8D0FA' : '#FFF3CD',
                    color: todayDone ? '#1c1c1c' : '#776A77',
                  }}
                >
                  {todayDone ? '오늘 완료 ✓' : '미완료'}
                </span>
              </div>
              {streak > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${(milestoneProgress / 7) * 100}%` }}
                        style={{ height: '100%', background: '#FF6B35', borderRadius: 99 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: '#737373', flexShrink: 0 }}>
                      {milestoneProgress} / 7일
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#737373' }}>
                    다음 마일스톤({nextMilestone}일)까지 <span style={{ fontWeight: 600, color: '#FF6B35' }}>{nextMilestone - streak}일</span> 남음
                  </p>
                </>
              )}
            </motion.div>
          );
        })()}

        {/* Quick action */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1c1c1c', marginBottom: 10 }}>빠른 시작</h2>
          <button
            onClick={() => navigate('/vocabulary')}
            className="w-full flex items-center gap-4 rounded-2xl p-4 active:scale-98 transition-transform"
            style={{ background: '#B8D0FA', boxShadow: '0 4px 12px rgba(184,208,250,0.5)' }}
          >
            <div className="rounded-xl flex items-center justify-center"
              style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.4)' }}>
              <BookOpen size={24} color="#1c1c1c" />
            </div>
            <div className="text-left flex-1">
              <p style={{ fontWeight: 700, color: '#1c1c1c', fontSize: 15 }}>단어장 학습하기</p>
              <p style={{ fontSize: 12, color: 'rgba(28,28,28,0.65)', marginTop: 1 }}>TOEIC 핵심 단어 55개 수록</p>
            </div>
            <ChevronRight size={20} color="#1c1c1c" />
          </button>
        </motion.div>

        {/* Today's goal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4"
          style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} color="#94B9F3" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1c1c1c' }}>오늘의 학습 목표</h3>
          </div>
          {[
            { label: '단어 암기하기', done: totalLearned >= 10, count: `${Math.min(totalLearned, 10)}/10` },
            { label: '테스트 완료하기', done: totalTested >= 1, count: `${Math.min(totalTested, 1)}/1` },
          ].map((goal) => (
            <div key={goal.label} className="flex items-center gap-3 py-2">
              <div className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 22, height: 22, background: goal.done ? '#B8D0FA' : '#f3f3f5' }}>
                {goal.done && <span style={{ fontSize: 12 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 14, color: goal.done ? '#737373' : '#1c1c1c',
                textDecoration: goal.done ? 'line-through' : 'none' }}>
                {goal.label}
              </span>
              <span style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600 }}>{goal.count}</span>
            </div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-4"
          style={{ background: '#F8EDD6' }}
        >
          <p style={{ fontSize: 12, color: '#776A77', fontWeight: 600, marginBottom: 4 }}>💡 학습 팁</p>
          <p style={{ fontSize: 13, color: '#1c1c1c', lineHeight: 1.7 }}>
            암기한 단어는 테스트로 확인하세요. 직접 스펠링을 쓰면 기억에 훨씬 오래 남아요!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
