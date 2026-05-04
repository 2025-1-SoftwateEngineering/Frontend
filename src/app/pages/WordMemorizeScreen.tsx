import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { vocaApi } from "../../main/features/domain/voca/vocaApi";
import { useProgress } from "../../main/features/domain/voca/ProgressContext";
import type {
  VocaBook,
  Word,
} from "../../main/features/domain/voca/types";
import { MobileLayout } from "../components/MobileLayout";

export function WordMemorizeScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { markLearned, progress } = useProgress();

  const [book, setBook] = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

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
  const learnedIds =
    progress[Number(bookId)]?.learnedWordIds ?? [];

  const goNext = () => {
    if (!current) return;
    markLearned(Number(bookId), current.word_id);
    if (idx < words.length - 1) {
      setIdx(idx + 1);
      setRevealed(false);
    } else {
      markLearned(Number(bookId), current.word_id);
      setDone(true);
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
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    )
      return;
    const dx =
      e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(
      e.changedTouches[0].clientY - touchStartY.current,
    );
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
          <p style={{ color: "#737373" }}>로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (done) {
    return (
      <MobileLayout>
        <div
          className="flex flex-col"
          style={{ height: "100dvh", background: "#f8f9ff" }}
        >
          <div
            className="px-4 pt-12 pb-3 flex items-center"
            style={{
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${bookId}`)}
              aria-label="뒤로가기"
              className="text-[#737373] bg-transparent border-none"
            >
              <ChevronLeft size={26} />
            </button>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1c1c1c",
                marginLeft: 8,
              }}
            >
              암기 완료
            </h1>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span style={{ fontSize: 72 }}>🎉</span>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#1c1c1c",
              }}
            >
              모두 암기했어요!
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#737373",
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              {words.length}개 단어를 모두 학습했습니다.
              <br />
              테스트로 실력을 확인해 보세요!
            </p>

            <div
              className="w-full rounded-2xl p-5"
              style={{
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex justify-between items-center">
                <span
                  style={{ fontSize: 14, color: "#737373" }}
                >
                  총 암기 단어
                </span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#94B9F3",
                  }}
                >
                  {words.length}개
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() =>
                  navigate(`/vocabulary/${bookId}/test`)
                }
                className="w-full rounded-2xl py-4 bg-[#B8D0FA] text-[#1c1c1c] text-[16px] font-bold"
              >
                테스트 하러 가기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdx(0);
                  setRevealed(false);
                  setDone(false);
                }}
                className="w-full rounded-2xl py-4 bg-[#f3f3f5] text-[#1c1c1c] text-[16px] font-semibold"
              >
                처음부터 다시 보기
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(`/vocabulary/${bookId}`)
                }
                className="w-full rounded-2xl py-4 bg-transparent text-[#737373] text-[15px] font-medium"
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
  const progressPct = Math.round(
    ((idx + 1) / words.length) * 100,
  );

  return (
    <MobileLayout>
      <div
        className="flex flex-col"
        style={{ height: "100dvh", background: "#f8f9ff" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-4 pt-12 pb-4"
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${bookId}`)}
              aria-label="뒤로가기"
              className="text-[#737373] bg-transparent border-none"
            >
              <ChevronLeft size={26} />
            </button>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1c1c1c",
              }}
            >
              단어 암기
            </h1>
            <span
              className="ml-auto"
              style={{ fontSize: 13, color: "#737373" }}
            >
              {idx + 1} / {words.length}
            </span>
          </div>
          <div
            style={{
              background: "#f0f0f0",
              borderRadius: 99,
              height: 6,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${progressPct}%` }}
              style={{
                height: "100%",
                background: "#B8D0FA",
                borderRadius: 99,
              }}
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
              className="rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
              }}
            >
              <div
                className="p-8 flex flex-col items-center justify-center gap-3"
                style={{ background: "#fff", minHeight: 200 }}
              >
                {isLearned && (
                  <span
                    className="px-2.5 py-0.5 rounded-full"
                    style={{
                      fontSize: 11,
                      background: "#EDE9BF",
                      color: "#776A77",
                      fontWeight: 600,
                    }}
                  >
                    ✓ 암기 완료
                  </span>
                )}
                <p
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#1c1c1c",
                    textAlign: "center",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {current?.english_word}
                </p>
              </div>

              <div
                className="relative cursor-pointer active:opacity-80 transition-opacity"
                onClick={() => setRevealed(!revealed)}
                style={{ minHeight: 100 }}
              >
                {revealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 flex flex-col items-center gap-2"
                    style={{ background: "#B8D0FA" }}
                  >
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1c1c1c",
                        textAlign: "center",
                      }}
                    >
                      {current?.meaning}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <EyeOff
                        size={14}
                        color="rgba(28,28,28,0.55)"
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(28,28,28,0.55)",
                        }}
                      >
                        다시 터치하면 가려집니다
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    className="p-6 flex flex-col items-center justify-center gap-2"
                    style={{
                      background: "#94B9F3",
                      minHeight: 100,
                    }}
                  >
                    <Eye
                      size={22}
                      color="rgba(255,255,255,0.8)"
                    />
                    <p
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 600,
                      }}
                    >
                      터치하면 뜻을 볼 수 있어요
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3">
            <div
              className="flex items-center gap-1.5 px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.8)" }}
            >
              <span style={{ fontSize: 16 }}>←</span>
              <span style={{ fontSize: 12, color: "#737373" }}>
                스와이프로 이동
              </span>
              <span style={{ fontSize: 16 }}>→</span>
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 px-5 py-4 flex gap-3"
          style={{
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            className={`flex-1 rounded-2xl py-3.5 active:scale-95 transition-transform ${
              idx === 0
                ? "bg-[#f0f0f0] text-[#ccc]"
                : "bg-[#f3f3f5] text-[#1c1c1c]"
            } text-[15px] font-semibold`}
          >
            ← 이전
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-2xl py-3.5 active:scale-95 transition-transform bg-[#B8D0FA] text-[#1c1c1c] text-[15px] font-bold"
          >
            {idx < words.length - 1 ? "다음 →" : "완료 ✓"}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}