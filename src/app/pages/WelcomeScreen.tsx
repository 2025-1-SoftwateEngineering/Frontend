import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MobileLayout } from '../components/MobileLayout';

function BackgroundGraphic() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 430 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="360" cy="120" r="140" fill="#B8D0FA" fillOpacity="0.25" />
      <circle cx="60"  cy="200" r="90"  fill="#94B9F3" fillOpacity="0.18" />
      <circle cx="400" cy="750" r="170" fill="#DDDEA5" fillOpacity="0.22" />
      <circle cx="30"  cy="700" r="110" fill="#EDE9BF" fillOpacity="0.25" />
      <circle cx="200" cy="80"  r="6"  fill="#B8D0FA" fillOpacity="0.5" />
      <circle cx="130" cy="150" r="4"  fill="#94B9F3" fillOpacity="0.4" />
      <circle cx="300" cy="300" r="5"  fill="#776A77" fillOpacity="0.2" />
      <circle cx="80"  cy="500" r="7"  fill="#DDDEA5" fillOpacity="0.5" />
      <circle cx="390" cy="420" r="5"  fill="#B8D0FA" fillOpacity="0.45" />
      <path d="M 0 830 Q 100 800 200 840 Q 300 880 430 850 L 430 900 L 0 900 Z"
        fill="#B8D0FA" fillOpacity="0.15" />
      <path d="M 0 860 Q 120 840 250 870 Q 350 900 430 875 L 430 900 L 0 900 Z"
        fill="#94B9F3" fillOpacity="0.12" />
    </svg>
  );
}

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="relative flex-1 flex flex-col overflow-hidden" style={{ background: '#fff' }}>
        <BackgroundGraphic />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-6 pt-14"
        >
          <div className="rounded-xl flex items-center justify-center"
            style={{ width: 36, height: 36, background: '#B8D0FA' }}>
            <span style={{ fontSize: 18 }}>📖</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1c1c1c' }}>SCOI</span>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 20 }}
            className="text-center"
          >
            <p style={{ fontSize: 14, color: '#94B9F3', fontWeight: 600, marginBottom: 12, letterSpacing: '0.05em' }}>
              TOEIC 영단어 학습 앱
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1c1c1c', lineHeight: 1.4, marginBottom: 16 }}>
              영단어 마스터를 위한<br />목표 달성 코치
            </h1>
            <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.7 }}>
              매일 꾸준히 학습하고<br />TOEIC 고득점을 향해 나아가세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="my-10"
          >
            <div
              className="rounded-3xl flex items-center justify-center shadow-md"
              style={{ width: 160, height: 160, background: 'linear-gradient(135deg, #B8D0FA, #94B9F3)' }}
            >
              <span style={{ fontSize: 72 }}>🎯</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-6 pb-10 z-10"
        >
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-2xl py-4 shadow-md active:scale-95 transition-transform"
            style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 17, fontWeight: 700 }}
          >
            시작하기
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
