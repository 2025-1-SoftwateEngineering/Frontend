import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

// ─────────────────────────────────────────────
//  상수
// ─────────────────────────────────────────────

const INIT_SECONDS = 10;  // 기본 타이머 시간
const WARN_SECONDS = 5;   // 빨간색 경고 시작 시간

// ─────────────────────────────────────────────
//  타입 정의
// ─────────────────────────────────────────────

export interface QuizQuestion {
  id: number;
  word: string;           // 출제 영어 단어
  pronunciation?: string; // 발음 기호 (선택)
  choices: string[];      // 4개 보기
  answerIndex: number;    // 정답 인덱스 (기능 담당자 연결용)
}

type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dim';
type CardState   = 'idle' | 'correct' | 'wrong';

// ─────────────────────────────────────────────
//  샘플 데이터 — 실제 데이터로 교체 가능
// ─────────────────────────────────────────────

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  { id: 1, word: 'ambiguous',  pronunciation: '/æmˈbɪɡjuəs/', choices: ['명확한', '모호한', '단순한', '복잡한'],          answerIndex: 1 },
  { id: 2, word: 'eloquent',   pronunciation: '/ˈeləkwənt/',  choices: ['말을 잘하는', '조용한', '무뚝뚝한', '시끄러운'],  answerIndex: 0 },
  { id: 3, word: 'diligent',   pronunciation: '/ˈdɪlɪdʒənt/', choices: ['나태한', '재능있는', '성실한', '창의적인'],       answerIndex: 2 },
  { id: 4, word: 'resilient',  pronunciation: '/rɪˈzɪliənt/', choices: ['약한', '빠른', '회복력 있는', '유연하지 않은'],   answerIndex: 2 },
  { id: 5, word: 'inevitable', pronunciation: '/ɪnˈevɪtəbl/', choices: ['피할 수 있는', '불가피한', '무서운', '놀라운'],   answerIndex: 1 },
];

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

// ─────────────────────────────────────────────
//  Props 타입
// ─────────────────────────────────────────────

interface QuizGameScreenProps {
  questions?: QuizQuestion[];
  score?: number;                                                     // 기능 담당자: 점수 연결
  onBack?: () => void;
  onAnswer?: (questionId: number, choiceIndex: number, isCorrect: boolean) => void;
  onNext?: (questionId: number) => void;
  onComplete?: (results: { id: number; selected: number; correct: boolean }[]) => void;
}

// ─────────────────────────────────────────────
//  보기 버튼 스타일 헬퍼
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
//  메인 컴포넌트
// ─────────────────────────────────────────────

export function QuizGameScreen({
  questions = SAMPLE_QUESTIONS,
  score = 0,
  onBack,
  onAnswer,
  onNext,
  onComplete,
}: QuizGameScreenProps) {
  const navigate = useNavigate();

  const [idx, setIdx]               = useState(0);
  const [answered, setAnswered]     = useState(false);
  const [choiceStates, setChoiceStates] = useState<ChoiceState[]>(['idle', 'idle', 'idle', 'idle']);
  const [cardState, setCardState]   = useState<CardState>('idle');
  const [resultMsg, setResultMsg]   = useState('');
  const [timer, setTimer]           = useState(INIT_SECONDS);
  const [history, setHistory]       = useState<{ id: number; selected: number; correct: boolean }[]>([]);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = questions[idx];
  const isLast  = idx === questions.length - 1;
  const isTimeWarning = timer <= WARN_SECONDS;

  // ── 타이머 시작 ──
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(INIT_SECONDS);
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  // 타이머 0 → 자동 오답 처리
  useEffect(() => {
    if (timer === 0 && !answered) handlePick(-1);
  }, [timer, answered]);

  // 문제 전환 시 타이머 재시작
  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [idx]);

  // ── 보기 선택 (즉시 제출) ──
  const handlePick = (i: number) => {
    if (answered) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnswered(true);

    const isCorrect = i === current.answerIndex;
    const newStates: ChoiceState[] = current.choices.map((_, j) => {
      if (j === current.answerIndex) return 'correct';
      if (j === i && !isCorrect)     return 'wrong';
      return 'dim';
    });

    setChoiceStates(newStates);
    setCardState(isCorrect ? 'correct' : 'wrong');
    setResultMsg(
      i === -1
        ? `시간 초과! 정답: ${current.choices[current.answerIndex]}`
        : isCorrect
          ? '정답이에요! 🎉'
          : `오답! 정답: ${current.choices[current.answerIndex]}`
    );

    const entry = { id: current.id, selected: i, correct: isCorrect };
    setHistory((prev) => [...prev, entry]);
    onAnswer?.(current.id, i, isCorrect);
  };

  // ── 다음 문제 ──
  const handleNext = () => {
    if (!answered) return;
    onNext?.(current.id);

    if (isLast) {
      onComplete?.([...history]);
    } else {
      setIdx((n) => n + 1);
      setAnswered(false);
      setChoiceStates(['idle', 'idle', 'idle', 'idle']);
      setCardState('idle');
      setResultMsg('');
    }
  };

  const handleBack = () => { if (onBack) onBack(); else navigate(-1); };

  return (
    <MobileLayout>
      <div className="flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>

        {/* ── 헤더 ── */}
        <div
          className="flex-shrink-0 px-4 pt-12 pb-4"
          style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}
        >
          <div className="flex items-center gap-2 mb-3">

            {/* 뒤로가기 */}
            <button
              onClick={handleBack}
              style={{ color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="뒤로가기"
            >
              <ChevronLeft size={26} />
            </button>

            {/* 타이머 — 중앙 */}
            <div
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5"
              style={{
                background: isTimeWarning ? '#fff3f3' : '#f8f8f8',
                border: `1px solid ${isTimeWarning ? '#f87171' : '#e5e7eb'}`,
                animation: isTimeWarning && !answered ? 'pulse 0.6s ease infinite' : 'none',
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
              <span style={{ fontSize: 13, fontWeight: 700, color: '#B8860B' }}>{score}</span>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="flex justify-end mb-1">
            <span style={{ fontSize: 12, color: '#737373' }}>{idx + 1} / {questions.length}</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              style={{ height: '100%', background: '#B8D0FA', borderRadius: 99 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* ── 본문 ── */}
        <div className="flex-1 flex flex-col justify-center px-5 gap-4">

          {/* 단어 카드 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`word-${current.id}`}
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
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                ...getCardStyle(cardState),
              }}
            >
              <p style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                다음 단어의 뜻은?
              </p>
              <p style={{
                fontSize: 34, fontWeight: 700, letterSpacing: '-0.5px',
                color: cardState === 'correct' ? '#16a34a' : cardState === 'wrong' ? '#dc2626' : '#1c1c1c',
                transition: 'color 0.2s',
              }}>
                {current.word}
              </p>
              {current.pronunciation && (
                <p style={{ fontSize: 13, color: '#737373', fontStyle: 'italic' }}>{current.pronunciation}</p>
              )}
              {resultMsg !== '' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 13, fontWeight: 700, marginTop: 2,
                    color: cardState === 'correct' ? '#16a34a' : '#dc2626',
                  }}
                >
                  {resultMsg}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 보기 4개 — 터치 즉시 제출 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`choices-${current.id}`}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {current.choices.map((choice, i) => {
                const state = choiceStates[i];
                return (
                  <motion.button
                    key={i}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handlePick(i)}
                    disabled={answered}
                    className="w-full flex items-center gap-3 rounded-2xl text-left"
                    style={{
                      padding: '14px 16px',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      ...getChoiceStyle(state),
                    }}
                  >
                    {/* 라벨 뱃지 */}
                    <span
                      className="flex items-center justify-center flex-shrink-0 rounded-xl"
                      style={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, transition: 'all 0.2s', ...getBadgeStyle(state) }}
                    >
                      {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : CHOICE_LABELS[i]}
                    </span>

                    {/* 보기 텍스트 */}
                    <span style={{
                      flex: 1, fontSize: 16, color: '#1c1c1c',
                      fontWeight: state === 'correct' || state === 'wrong' ? 700 : 500,
                    }}>
                      {choice}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── 하단 버튼 ── */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}
        >
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
