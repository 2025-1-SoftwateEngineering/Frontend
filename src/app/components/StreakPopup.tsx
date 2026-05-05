import { motion, AnimatePresence } from 'motion/react';
import type { StreakResult } from '../../main/features/domain/streak/StreakContext';

interface Props {
  result: StreakResult | null;
  onClose: () => void;
}

export function StreakPopup({ result, onClose }: Props) {
  const visible = result !== null && !result.isAlreadyDone;

  return (
    <AnimatePresence>
      {visible && result && (
        <motion.div
          key="streak-popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(28,28,28,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            key="streak-popup-card"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center gap-4"
            style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
          >
            {result.isMilestone ? (
              <>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: 2, duration: 0.4 }}
                  style={{ fontSize: 64 }}
                >
                  🎉
                </motion.span>
                <div className="text-center">
                  <p style={{ fontSize: 26, fontWeight: 800, color: '#1c1c1c' }}>
                    {result.milestoneDay}일 달성!
                  </p>
                  <p style={{ fontSize: 15, color: '#737373', marginTop: 6, lineHeight: 1.6 }}>
                    {result.milestoneDay}일 연속 학습을 달성했습니다!
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl"
                  style={{ background: '#EDE9BF' }}
                >
                  <span style={{ fontSize: 20 }}>🪙</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#776A77' }}>
                    +{result.rewardCurrency} 재화 획득!
                  </span>
                </div>
              </>
            ) : (
              <>
                <motion.span
                  animate={{ rotate: [-10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: 64 }}
                >
                  🔥
                </motion.span>
                <div className="text-center">
                  <p style={{ fontSize: 26, fontWeight: 800, color: '#1c1c1c' }}>
                    {result.currentStreak}일 연속 학습!
                  </p>
                  <p style={{ fontSize: 15, color: '#737373', marginTop: 6, lineHeight: 1.6 }}>
                    오늘도 학습을 완료했어요!
                    {result.isNewRecord && (
                      <span style={{ display: 'block', color: '#94B9F3', fontWeight: 600, marginTop: 4 }}>
                        🏆 새로운 최고 기록!
                      </span>
                    )}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: '#f8f9ff' }}
                >
                  <span style={{ fontSize: 13, color: '#94B9F3', fontWeight: 600 }}>
                    다음 마일스톤까지 {7 - (result.currentStreak % 7)}일
                  </span>
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="w-full rounded-2xl py-4 active:scale-95 transition-transform"
              style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700, marginTop: 4 }}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
