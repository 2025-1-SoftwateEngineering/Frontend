import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { TestSubmitAnswer } from '../../main/features/domain/voca/vocaApi';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import type { VocaBook, Word } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';

type Phase = 'test' | 'result';

export function WordTestScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { addTestResult } = useProgress();
  const { currentUser } = useAuth();

  const [book, setBook] = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [answers, setAnswers] = useState<TestSubmitAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>('test');
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!bookId) return;
    vocaApi.getBook(Number(bookId)).then((b) => {
      setBook(b);
      const shuffled = [...b.words].sort(() => Math.random() - 0.5);
      setWords(shuffled);
    });
  }, [bookId]);

  useEffect(() => {
    if (phase === 'test') inputRef.current?.focus();
  }, [idx, phase]);

  const current = words[idx];

  const handleCheck = () => {
    if (!current || checked) return;
    const correct = input.trim().toLowerCase() === current.english_word.toLowerCase();
    setIsCorrect(correct);
    setChecked(true);
  };

  const handleNext = async () => {
    const newAnswer: TestSubmitAnswer = { wordId: current.word_id, answer: input.trim() };
    const newAnswers = [...answers, newAnswer];
    const newScores = [...scores, isCorrect];

    if (idx < words.length - 1) {
      setAnswers(newAnswers);
      setScores(newScores);
      setIdx(idx + 1);
      setInput('');
      setChecked(false);
      setIsCorrect(false);
    } else {
      const score = Math.round((newScores.filter(Boolean).length / words.length) * 100);
      const xpGain = newScores.filter(Boolean).length * 10;
      addTestResult(Number(bookId), { score, total: words.length, date: new Date().toISOString() }, xpGain);

      if (currentUser) {
        try {
          const result = await vocaApi.completeTest(Number(bookId), newAnswers);
          setEarnedCoins(result.earnedCoins);
        } catch {
          setEarnedCoins(null);
        }
      }

      setAnswers(newAnswers);
      setScores(newScores);
      setPhase('result');
    }
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
    const msg = pct >= 80 ? '훌륭해요!' : pct >= 50 ? '잘 하고 있어요!' : '더 연습이 필요해요!';
    const localXP = correct * 10;

    return (
      <MobileLayout>
        <div className="flex flex-col h-dvh bg-surface-page">
          <div className="px-4 pt-12 pb-3 flex items-center bg-white border-b border-surface-lighter">
            <button type="button" onClick={() => navigate(`/vocabulary/${bookId}`)} title="뒤로 가기" className="text-text-sub bg-transparent border-0">
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main ml-2">테스트 완료</h1>
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
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-brand-blue-dark">{correct}</p>
                  <p className="text-xs text-text-sub">정답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{words.length - correct}</p>
                  <p className="text-xs text-text-sub">오답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-yellow">+{localXP}</p>
                  <p className="text-xs text-text-sub">XP 획득</p>
                </div>
              </div>
              {earnedCoins !== null && (
                <div className="mt-3 pt-3 flex items-center justify-center gap-2 border-t border-surface-lighter">
                  <span className="text-[18px]">🪙</span>
                  <span className="text-[15px] font-bold text-text-main">+{earnedCoins} 코인 획득!</span>
                </div>
              )}
            </div>

            {words.some((_, i) => !scores[i]) && (
              <div className="w-full">
                <p className="text-[13px] font-semibold text-destructive mb-2">틀린 단어 복습</p>
                <div className="flex flex-col gap-2">
                  {words.filter((_, i) => !scores[i]).map((w) => (
                    <div key={w.word_id} className="rounded-xl p-3 flex justify-between bg-[#fff3f3]">
                      <span className="font-semibold text-text-main">{w.english_word}</span>
                      <span className="text-text-sub text-[13px]">{w.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  setIdx(0); setInput(''); setChecked(false);
                  setScores([]); setAnswers([]); setPhase('test');
                  setEarnedCoins(null);
                  setWords([...words].sort(() => Math.random() - 0.5));
                }}
                className="w-full rounded-2xl py-4 bg-brand-blue text-text-main text-base font-bold"
              >
                다시 테스트하기
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

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2 mb-3">
            <button type="button" aria-label="Back" onClick={() => navigate(`/vocabulary/${bookId}`)} className="text-text-sub bg-transparent border-0">
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main">단어 테스트</h1>
            <span className="ml-auto text-[13px] text-text-sub">{idx + 1} / {words.length}</span>
          </div>
          <div className="bg-surface-lighter rounded-full h-1.5 overflow-hidden">
            <motion.div
              animate={{ width: `${((idx + (checked ? 1 : 0)) / words.length) * 100}%` }}
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
              className="rounded-3xl p-6 flex flex-col gap-3 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <p className="text-xs text-brand-blue-dark font-semibold uppercase tracking-[0.08em]">뜻</p>
              <p className="text-[22px] font-bold text-text-main leading-[1.4]">{current?.meaning}</p>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-2xl p-4 bg-white shadow-sm">
            <p className="text-xs text-text-sub mb-2">영어 단어를 입력하세요</p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (checked ? handleNext() : handleCheck())}
                placeholder="영어 스펠링 입력..."
                disabled={checked}
                className={`flex-1 px-[14px] py-3 rounded-xl text-base outline-none bg-surface-input text-text-main ${checked ? `border-2 ${isCorrect ? 'border-[#4ade80]' : 'border-[#f87171]'}` : 'border border-[#e5e7eb]'}`}
              />
              {checked ? (
                isCorrect
                  ? <CheckCircle size={28} color="#4ade80" className="self-center flex-shrink-0" />
                  : <XCircle size={28} color="#f87171" className="self-center flex-shrink-0" />
              ) : null}
            </div>
            {checked && !isCorrect && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-brand-blue-dark mt-2 font-semibold">
                정답: <span className="text-text-main">{current?.english_word}</span>
              </motion.p>
            )}
            {checked && isCorrect && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#4ade80] mt-2 font-semibold">
                정답입니다! 🎉
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className={`w-full rounded-2xl py-4 active:scale-95 transition-transform text-base font-bold text-text-main ${input.trim() ? 'bg-brand-blue' : 'bg-[#e5e7eb]'}`}
            >
              확인하기
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full rounded-2xl py-4 active:scale-95 transition-transform bg-brand-blue-dark text-text-main text-base font-bold"
            >
              {idx < words.length - 1 ? '다음 단어 →' : '결과 보기'}
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
