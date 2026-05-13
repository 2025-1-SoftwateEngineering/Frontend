import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { StreakResult } from '../../main/features/domain/streak/StreakContext';

interface Props {
  result: StreakResult | null;
  onClose: () => void;
}

export function StreakPopup({ result, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result && !result.isAlreadyDone) setVisible(true);
  }, [result]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!result || result.isAlreadyDone) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center gap-4"
            style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {result.isMilestone ? (
              <>
                <motion.span
                  style={{ fontSize: 64 }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  🎉
                </motion.span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1c1c1c', textAlign: 'center' }}>
                  {result.milestoneDay}일 달성!
                </h2>
                <p style={{ fontSize: 14, color: '#737373', textAlign: 'center', lineHeight: 1.6 }}>
                  7일 마일스톤을 달성했어요!<br />보상 재화를 획득했습니다.
                </p>
                <div className="rounded-2xl px-6 py-3 flex items-center gap-2"
                  style={{ background: '#F8EDD6' }}>
                  <span style={{ fontSize: 20 }}>🪙</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#776A77' }}>
                    +{result.rewardCurrency} 코인
                  </span>
                </div>
              </>
            ) : (
              <>
                <motion.span
                  style={{ fontSize: 64 }}
                  animate={{ x: [0, -6, 6, -4, 4, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  🔥
                </motion.span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1c1c1c' }}>
                  {result.currentStreak}일 연속 학습!
                </h2>
                <p style={{ fontSize: 14, color: '#737373', textAlign: 'center', lineHeight: 1.6 }}>
                  {result.isNewRecord
                    ? '새 기록을 세웠어요! 계속 유지해봐요 💪'
                    : `다음 마일스톤까지 ${7 - (result.currentStreak % 7)}일 남았어요`}
                </p>
              </>
            )}

            <button
              onClick={handleClose}
              className="w-full rounded-2xl py-3.5 mt-1 active:scale-95 transition-transform"
              style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700, border: 'none' }}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
