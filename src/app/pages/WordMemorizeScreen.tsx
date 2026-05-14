import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { vocaApi } from "../../main/features/domain/voca/vocaApi";
import { useProgress } from "../../main/features/domain/voca/ProgressContext";
import { useStreak } from "../../main/features/domain/streak/StreakContext";
import type { StreakResult } from "../../main/features/domain/streak/StreakContext";
import { StreakPopup } from "../components/StreakPopup";
import type { VocaBook, Word } from "../../main/features/domain/voca/types";
import { MobileLayout } from "../components/MobileLayout";

export function WordMemorizeScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { markLearned, progress } = useProgress();
  const { completeStudy } = useStreak();

  const [book, setBook] = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [streakResult, setStreakResult] = useState<StreakResult | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!bookId) return;
    vocaApi.getBook(Number(bookId)).then((b) => {
      setBook(b);
      setWords(b.words);
    });
  }, [bookId]);

  const current = words[idx];
  const learnedIds = progress[Number(bookId)]?.learnedWordIds ?? [];

  const goNext = () => {
    if (!current) return;
    markLearned(Number(bookId), current.word_id);
    if (idx < words.length - 1) {
      setIdx(idx + 1);
      setRevealed(false);
    } else {
      markLearned(Number(bookId), current.word_id);
      setDone(true);
      const result = completeStudy();
      if (!result.isAlreadyDone) setStreakResult(result);
    }
  };

  const goPrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setRevealed(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && dy < 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!book || words.length === 0) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-sub">로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (done) {
    return (
      <MobileLayout>
        <StreakPopup result={streakResult} onClose={() => setStreakResult(null)} />
        <div className="flex flex-col h-dvh bg-surface-page">
          <div className="px-4 pt-12 pb-3 flex items-center bg-white border-b border-surface-lighter">
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${bookId}`)}
              aria-label="뒤로가기"
              className="text-text-sub bg-transparent border-0"
            >
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main ml-2">암기 완료</h1>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-[72px]">🎉</span>
            <h2 className="text-[26px] font-bold text-text-main">모두 암기했어요!</h2>
            <p className="text-[15px] text-text-sub text-center leading-[1.7]">
              {words.length}개 단어를 모두 학습했습니다.
              <br />
              테스트로 실력을 확인해 보세요!
            </p>

            <div className="w-full rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-sub">총 암기 단어</span>
                <span className="text-[22px] font-bold text-brand-blue-dark">{words.length}개</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => navigate(`/vocabulary/${bookId}/test`)}
                className="w-full rounded-2xl py-4 bg-brand-blue text-text-main text-base font-bold"
              >
                테스트 하러 가기
              </button>
              <button
                type="button"
                onClick={() => { setIdx(0); setRevealed(false); setDone(false); }}
                className="w-full rounded-2xl py-4 bg-surface-muted text-text-main text-base font-semibold"
              >
                처음부터 다시 보기
              </button>
              <button
                type="button"
                onClick={() => navigate(`/vocabulary/${bookId}`)}
                className="w-full rounded-2xl py-4 bg-transparent text-text-sub text-[15px] font-medium"
              >
                단어장으로 돌아가기
              </button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  const isLearned = learnedIds.includes(current?.word_id ?? -1);
  const progressPct = Math.round(((idx + 1) / words.length) * 100);

  return (
    <MobileLayout>
      <div
        className="flex flex-col h-dvh bg-surface-page"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${bookId}`)}
              aria-label="뒤로가기"
              className="text-text-sub bg-transparent border-0"
            >
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main">단어 암기</h1>
            <span className="ml-auto text-[13px] text-text-sub">{idx + 1} / {words.length}</span>
          </div>
          <div className="bg-surface-lighter rounded-full h-1.5 overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              className="h-full bg-brand-blue rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 gap-4 select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
            >
              <div className="p-8 flex flex-col items-center justify-center gap-3 bg-white min-h-[200px]">
                {isLearned && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-beige text-brand-purple">
                    ✓ 암기 완료
                  </span>
                )}
                <p className="text-[34px] font-extrabold text-text-main text-center tracking-[-0.5px]">
                  {current?.english_word}
                </p>
              </div>

              <div
                className="relative cursor-pointer active:opacity-80 transition-opacity min-h-[100px]"
                onClick={() => setRevealed(!revealed)}
              >
                {revealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 flex flex-col items-center gap-2 bg-brand-blue"
                  >
                    <p className="text-xl font-bold text-text-main text-center">{current?.meaning}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <EyeOff size={14} color="rgba(28,28,28,0.55)" />
                      <span className="text-xs text-text-main/55">다시 터치하면 가려집니다</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center gap-2 bg-brand-blue-dark min-h-[100px]">
                    <Eye size={22} color="rgba(255,255,255,0.8)" />
                    <p className="text-sm font-semibold text-white/85">터치하면 뜻을 볼 수 있어요</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80">
              <span className="text-base">←</span>
              <span className="text-xs text-text-sub">스와이프로 이동</span>
              <span className="text-base">→</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-4 flex gap-3 bg-white border-t border-surface-lighter">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            className={`flex-1 rounded-2xl py-3.5 active:scale-95 transition-transform text-[15px] font-semibold ${idx === 0 ? 'bg-surface-lighter text-[#ccc]' : 'bg-surface-muted text-text-main'}`}
          >
            ← 이전
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-2xl py-3.5 active:scale-95 transition-transform bg-brand-blue text-text-main text-[15px] font-bold"
          >
            {idx < words.length - 1 ? "다음 →" : "완료 ✓"}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
