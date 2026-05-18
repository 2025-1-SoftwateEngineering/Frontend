import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook, Word } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';

const INIT_SECONDS = 10;
const WARN_SECONDS = 5;
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

type Phase = 'quiz' | 'result';
type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dim';
type CardState = 'idle' | 'correct' | 'wrong';

function generateChoices(correct: Word, all: Word[]): Word[] {
  if (all.length <= 4) return [...all].sort(() => Math.random() - 0.5);
  const others = all.filter((w) => w.word_id !== correct.word_id);
  const picks = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...picks, correct].sort(() => Math.random() - 0.5);
}

function getChoiceStyle(state: ChoiceState): React.CSSProperties {
  switch (state) {
    case 'correct': return { background: '#f0fdf4', border: '1.5px solid #4ade80', boxShadow: '0 2px 8px rgba(74,222,128,0.2)' };
    case 'wrong':   return { background: '#fff5f5', border: '1.5px solid #f87171', boxShadow: '0 2px 8px rgba(248,113,113,0.2)' };
    case 'dim':     return { background: '#fafafa', border: '1.5px solid #e5e7eb', opacity: 0.45 };
    default:        return { background: '#fff',    border: '1.5px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
  }
}

function getBadgeStyle(state: ChoiceState): React.CSSProperties {
  switch (state) {
    case 'correct': return { background: '#4ade80', color: '#fff' };
    case 'wrong':   return { background: '#f87171', color: '#fff' };
    default:        return { background: '#f3f3f5', color: '#737373' };
  }
}

function getCardStyle(state: CardState): React.CSSProperties {
  switch (state) {
    case 'correct': return { background: '#f0fdf4', border: '1.5px solid #4ade80' };
    case 'wrong':   return { background: '#fff5f5', border: '1.5px solid #f87171' };
    default:        return { background: '#fff',    border: '1.5px solid transparent' };
  }
}

export function QuizScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate   = useNavigate();

  const [book, setBook]   = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx]     = useState(0);
  const [choices, setChoices]           = useState<Word[]>([]);
  const [selected, setSelected]         = useState<number | null>(null);
  const [choiceStates, setChoiceStates] = useState<ChoiceState[]>(['idle', 'idle', 'idle', 'idle']);
  const [cardState, setCardState]       = useState<CardState>('idle');
  const [resultMsg, setResultMsg]       = useState('');
  const [scores, setScores]             = useState<boolean[]>([]);
  const [phase, setPhase]               = useState<Phase>('quiz');
  const [timer, setTimer]               = useState(INIT_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const answered      = selected !== null;
  const current       = words[idx];
  const isLast        = idx === words.length - 1;
  const isTimeWarning = timer <= WARN_SECONDS;
  const correctCount  = scores.filter(Boolean).length;

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
      setChoiceStates(['idle', 'idle', 'idle', 'idle']);
      setCardState('idle');
      setResultMsg('');
    }
  }, [idx, words]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(INIT_SECONDS);
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(intervalRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (words.length > 0 && phase === 'quiz') {
      startTimer();
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [idx, words, phase, startTimer]);

  useEffect(() => {
    if (timer === 0 && !answered) handlePick(-1);
  }, [timer, answered]);

  const handlePick = (wordId: number) => {
    if (answered || !current) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(wordId);

    const isCorrect = wordId === current.word_id;
    setChoiceStates(
      choices.map((c) => {
        if (c.word_id === current.word_id) return 'correct';
        if (c.word_id === wordId && !isCorrect) return 'wrong';
        return 'dim';
      })
    );
    setCardState(isCorrect ? 'correct' : 'wrong');
    setResultMsg(
      wordId === -1
        ? `시간 초과! 정답: ${current.english_word}`
        : isCorrect
          ? '정답이에요! 🎉'
          : `오답! 정답: ${current.english_word}`
    );
  };

  const handleNext = () => {
    if (!answered || !current) return;
    const isCorrect  = selected === current.word_id;
    const newScores  = [...scores, isCorrect];
    if (isLast) {
      setScores(newScores);
      setPhase('result');
    } else {
      setScores(newScores);
      setIdx((n) => n + 1);
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

  // ── 결과 화면 ──────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const correct = scores.filter(Boolean).length;
    const pct     = Math.round((correct / words.length) * 100);
    const emoji   = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚';
    const msg     = pct >= 80 ? '훌륭해요!' : pct >= 50 ? '잘 하고 있어요!' : '더 연습이 필요해요!';

    return (
      <MobileLayout>
        <div className="flex flex-col h-dvh" style={{ background: '#f8f9ff' }}>
          <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/vocabulary/${bookId}`)}
                style={{ color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <ChevronLeft size={26} />
              </button>
              <h1 className="text-lg font-bold text-text-main">퀴즈 완료</h1>
            </div>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-[72px]">{emoji}</span>
            <h2 className="text-[28px] font-bold text-text-main">{pct}점</h2>
            <p className="text-base text-text-sub">{msg}</p>

            <div className="w-full rounded-2xl p-5 bg-white" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{correct}</p>
                  <p className="text-xs text-text-sub">정답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#f87171' }}>{words.length - correct}</p>
                  <p className="text-xs text-text-sub">오답</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleRetry}
                className="w-full rounded-2xl py-4 text-base font-bold"
                style={{ background: '#B8D0FA', color: '#1c1c1c', border: 'none', cursor: 'pointer' }}
              >
                다시 풀기
              </button>
              <button
                onClick={() => navigate(`/vocabulary/${bookId}`)}
                className="w-full rounded-2xl py-4 text-base font-semibold"
                style={{ background: '#f3f3f5', color: '#1c1c1c', border: 'none', cursor: 'pointer' }}
              >
                단어장으로 돌아가기
              </button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  // ── 퀴즈 화면 ──────────────────────────────────────────────────────────────
  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh" style={{ background: '#f8f9ff' }}>

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white" style={{ borderBottom: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate(`/vocabulary/${bookId}`)}
              aria-label="뒤로가기"
              style={{ color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <ChevronLeft size={26} />
            </button>

            {/* 타이머 */}
            <div
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5"
              style={{
                background: isTimeWarning ? '#fff3f3' : '#f8f8f8',
                border: `1px solid ${isTimeWarning ? '#f87171' : '#e5e7eb'}`,
              }}
            >
              <Clock size={14} color={isTimeWarning ? '#d4183d' : '#737373'} strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 700, color: isTimeWarning ? '#d4183d' : '#737373' }}>
                {timer}s
              </span>
            </div>

            {/* 점수 */}
            <div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}
            >
              <Star size={13} color="#B8860B" fill="#B8860B" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#B8860B' }}>{correctCount}</span>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="flex justify-end mb-1">
            <span style={{ fontSize: 12, color: '#737373' }}>{idx + 1} / {words.length}</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((idx + 1) / words.length) * 100}%` }}
              style={{ height: '100%', background: '#B8D0FA', borderRadius: 99 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 flex flex-col justify-center px-5 gap-4">

          {/* 단어 카드 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${idx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={
                cardState === 'correct'
                  ? { opacity: 1, x: 0, scale: [1, 1.04, 1] }
                  : cardState === 'wrong'
                    ? { opacity: 1, x: [0, -6, 6, -5, 5, 0] }
                    : { opacity: 1, x: 0 }
              }
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl p-6 flex flex-col items-center gap-2"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)', ...getCardStyle(cardState) }}
            >
              <p style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                알맞은 단어를 고르세요
              </p>
              <p style={{
                fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', textAlign: 'center', lineHeight: 1.4,
                color: cardState === 'correct' ? '#16a34a' : cardState === 'wrong' ? '#dc2626' : '#1c1c1c',
                transition: 'color 0.2s',
              }}>
                {current?.meaning}
              </p>
              {resultMsg && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 13, fontWeight: 700, marginTop: 2, color: cardState === 'correct' ? '#16a34a' : '#dc2626' }}
                >
                  {resultMsg}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 보기 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`choices-${idx}`}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {choices.map((choice, i) => {
                const state = choiceStates[i];
                return (
                  <motion.button
                    key={choice.word_id}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handlePick(choice.word_id)}
                    disabled={answered}
                    className="w-full flex items-center gap-3 rounded-2xl text-left"
                    style={{
                      padding: '14px 16px',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      border: 'none',
                      ...getChoiceStyle(state),
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0 rounded-xl"
                      style={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, transition: 'all 0.2s', ...getBadgeStyle(state) }}
                    >
                      {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : CHOICE_LABELS[i]}
                    </span>
                    <span style={{ flex: 1, fontSize: 16, color: '#1c1c1c', fontWeight: state === 'correct' || state === 'wrong' ? 700 : 500 }}>
                      {choice.english_word}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 하단 버튼 */}
        <div className="flex-shrink-0 px-5 py-4 bg-white" style={{ borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={handleNext}
            disabled={!answered}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              background: answered ? '#B8D0FA' : '#e5e7eb',
              color: answered ? '#1c1c1c' : '#9ca3af',
              fontSize: 16, fontWeight: 700, border: 'none',
              cursor: answered ? 'pointer' : 'not-allowed',
            }}
          >
            {isLast ? '결과 보기' : '다음 문제'}
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </MobileLayout>
  );
}
