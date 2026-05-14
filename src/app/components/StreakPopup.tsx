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
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center gap-4 bg-white shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {result.isMilestone ? (
              <>
                <motion.span
                  className="text-[64px]"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  🎉
                </motion.span>
                <h2 className="text-[22px] font-extrabold text-text-main text-center">
                  {result.milestoneDay}일 달성!
                </h2>
                <p className="text-sm text-text-sub text-center leading-relaxed">
                  7일 마일스톤을 달성했어요!<br />보상 재화를 획득했습니다.
                </p>
                <div className="rounded-2xl px-6 py-3 flex items-center gap-2 bg-brand-peach">
                  <span className="text-xl">🪙</span>
                  <span className="text-lg font-bold text-brand-purple">
                    +{result.rewardCurrency} 코인
                  </span>
                </div>
              </>
            ) : (
              <>
                <motion.span
                  className="text-[64px]"
                  animate={{ x: [0, -6, 6, -4, 4, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  🔥
                </motion.span>
                <h2 className="text-[22px] font-extrabold text-text-main">
                  {result.currentStreak}일 연속 학습!
                </h2>
                <p className="text-sm text-text-sub text-center leading-relaxed">
                  {result.isNewRecord
                    ? '새 기록을 세웠어요! 계속 유지해봐요 💪'
                    : `다음 마일스톤까지 ${7 - (result.currentStreak % 7)}일 남았어요`}
                </p>
              </>
            )}

            <button
              onClick={handleClose}
              className="w-full rounded-2xl py-3.5 mt-1 active:scale-95 transition-transform bg-brand-blue text-text-main text-base font-bold border-0"
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
