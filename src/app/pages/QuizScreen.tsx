import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook, Word } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';

type Phase = 'quiz' | 'result';

function generateChoices(correct: Word, all: Word[]): Word[] {
  if (all.length <= 4) return [...all].sort(() => Math.random() - 0.5);
  const others = all.filter((w) => w.word_id !== correct.word_id);
  const picks = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...picks, correct].sort(() => Math.random() - 0.5);
}

export function QuizScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<Word[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<Phase>('quiz');

  useEffect(() => {
    if (!bookId) return;
    vocaApi.getBook(Number(bookId)).then((b) => {
      setBook(b);
      setWords([...b.words].sort(() => Math.random() - 0.5));
    });
  }, [bookId]);

  useEffect(() => {
    if (words.length > 0 && words[idx]) {
      setChoices(generateChoices(words[idx], words));
      setSelected(null);
    }
  }, [idx, words]);

  const current = words[idx];

  const handleSelect = (wordId: number) => {
    if (selected !== null) return;
    setSelected(wordId);
  };

  const handleNext = () => {
    const correct = selected === current?.word_id;
    const newScores = [...scores, correct];

    if (idx < words.length - 1) {
      setScores(newScores);
      setIdx(idx + 1);
    } else {
      setScores(newScores);
      setPhase('result');
    }
  };

  const handleRetry = () => {
    setIdx(0);
    setScores([]);
    setPhase('quiz');
    setWords((prev) => [...prev].sort(() => Math.random() - 0.5));
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

  if (phase === 'result') {
    const correct = scores.filter(Boolean).length;
    const pct = Math.round((correct / words.length) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚';
    const msg   = pct >= 80 ? '훌륭해요!' : pct >= 50 ? '잘 하고 있어요!' : '더 연습이 필요해요!';

    return (
      <MobileLayout>
        <div className="flex flex-col h-dvh bg-surface-page">
          <div className="px-4 pt-4 pb-3 flex items-center bg-white border-b border-surface-lighter">
            <button type="button" onClick={() => navigate(`/vocabulary/${bookId}`)} className="text-text-sub bg-transparent border-0">
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main ml-2">퀴즈 완료</h1>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-[72px]">{emoji}</span>
            <h2 className="text-[28px] font-bold text-text-main">{pct}점</h2>
            <p className="text-base text-text-sub">{msg}</p>

            <div className="w-full rounded-2xl p-5 bg-white shadow-sm">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-brand-blue-dark">{correct}</p>
                  <p className="text-xs text-text-sub">정답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{words.length - correct}</p>
                  <p className="text-xs text-text-sub">오답</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleRetry}
                className="w-full rounded-2xl py-4 bg-brand-blue text-text-main text-base font-bold"
              >
                다시 풀기
              </button>
              <button
                onClick={() => navigate(`/vocabulary/${bookId}`)}
                className="w-full rounded-2xl py-4 bg-surface-muted text-text-main text-base font-semibold"
              >
                단어장으로 돌아가기
              </button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  const isCorrect = selected !== null && current && selected === current.word_id;

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">
        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2 mb-3">
            <button type="button" aria-label="Back" onClick={() => navigate(`/vocabulary/${bookId}`)} className="text-text-sub bg-transparent border-0">
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main">사지선다 퀴즈</h1>
            <span className="ml-auto text-[13px] text-text-sub">{idx + 1} / {words.length}</span>
          </div>
          <div className="bg-surface-lighter rounded-full h-1.5 overflow-hidden">
            <motion.div
              animate={{ width: `${((idx + (selected !== null ? 1 : 0)) / words.length) * 100}%` }}
              className="h-full bg-brand-blue rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="rounded-3xl p-6 flex flex-col gap-2 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <p className="text-xs text-brand-blue-dark font-semibold uppercase tracking-[0.08em]">뜻</p>
              <p className="text-[22px] font-bold text-text-main leading-[1.4]">{current?.meaning}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-2.5">
            {choices.map((choice) => {
              const isSelected = selected === choice.word_id;
              const isCorrectChoice = choice.word_id === current?.word_id;
              let style = 'bg-white border border-[#e5e7eb] text-text-main';
              if (selected !== null) {
                if (isCorrectChoice)              style = 'bg-[#dcfce7] border-2 border-[#4ade80] text-text-main';
                else if (isSelected)              style = 'bg-[#fee2e2] border-2 border-[#f87171] text-text-main';
                else                              style = 'bg-white border border-[#e5e7eb] text-text-sub opacity-60';
              }
              return (
                <motion.button
                  key={choice.word_id}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(choice.word_id)}
                  className={`rounded-2xl px-3 py-4 text-[15px] font-semibold text-center transition-all border-0 flex items-center justify-center gap-1.5 min-h-[64px] ${style}`}
                >
                  {selected !== null && isCorrectChoice && <CheckCircle size={15} color="#4ade80" className="flex-shrink-0" />}
                  {selected !== null && isSelected && !isCorrectChoice && <XCircle size={15} color="#f87171" className="flex-shrink-0" />}
                  {choice.english_word}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`w-full rounded-2xl py-4 text-base font-bold transition-colors text-text-main ${selected === null ? 'bg-[#e5e7eb]' : isCorrect ? 'bg-[#4ade80]' : 'bg-brand-blue-dark'}`}
          >
            {selected === null ? '보기를 선택하세요' : idx < words.length - 1 ? '다음 문제 →' : '결과 보기'}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
