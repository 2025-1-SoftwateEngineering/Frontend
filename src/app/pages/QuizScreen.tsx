import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { quizApi } from '../../main/features/domain/voca/vocaApi';
import type { ChoiceQuestion } from '../../main/features/domain/voca/vocaApi';
import { storeApi } from '../../main/features/domain/store/storeApi';
import type { MyItemInfo } from '../../main/features/domain/store/storeApi';
import { MobileLayout } from '../components/MobileLayout';

const INIT_SECONDS = 10;
const WARN_SECONDS = 5;
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

type Phase = 'loading' | 'quiz' | 'result';
type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dim';
type CardState = 'idle' | 'correct' | 'wrong';

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
  const { choiceId } = useParams<{ choiceId: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [question, setQuestion] = useState<ChoiceQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);

  const [choiceStates, setChoiceStates] = useState<ChoiceState[]>(['idle', 'idle', 'idle', 'idle']);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [resultMsg, setResultMsg] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [timer, setTimer] = useState(INIT_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitResultRef = useRef<{ hasNext: boolean; nextCurrent: number | null } | null>(null);

  const [timeItems, setTimeItems] = useState<MyItemInfo[]>([]);

  const isTimeWarning = timer <= WARN_SECONDS;

  const loadQuestion = useCallback(async (current: number) => {
    if (!choiceId) return;
    const q = await quizApi.getChoiceQuestion(Number(choiceId), current);
    if (q) {
      setQuestion(q);
      setAnswered(false);
      setChoiceStates(['idle', 'idle', 'idle', 'idle']);
      setCardState('idle');
      setResultMsg('');
      submitResultRef.current = null;
      setQuestionNumber((n) => n + 1);
      setPhase('quiz');
    } else {
      setPhase('result');
    }
  }, [choiceId]);

  useEffect(() => {
    loadQuestion(0);
    storeApi.getMyItems().then((res) => {
      setTimeItems(res.items.filter(i =>
        i.item.itemType === 'CHOICE_TIME_10' || i.item.itemType === 'CHOICE_TIME_30'
      ));
    }).catch(() => {});
  }, [loadQuestion]);

  const handleUseTimeItem = async (item: MyItemInfo) => {
    try {
      await storeApi.useItem(item.item.itemId);
      const bonus = item.item.itemType === 'CHOICE_TIME_10' ? 10 : 30;
      setTimer(t => t + bonus);
      setTimeItems(prev => prev.map(i =>
        i.item.itemId === item.item.itemId ? { ...i, count: i.count - 1 } : i
      ));
    } catch {
      // 이미 활성화된 경우 등 무시
    }
  };

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
    if (phase === 'quiz' && question) {
      startTimer();
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [question?.id, phase, startTimer]);

  useEffect(() => {
    if (timer === 0 && !answered && phase === 'quiz') handlePick(null);
  }, [timer, answered, phase]);

  const handlePick = async (optionId: number | null) => {
    if (answered || !question || !choiceId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAnswered(true);

    try {
      const result = await quizApi.submitChoiceAnswer(Number(choiceId), optionId ?? 0, question.id);
      const isCorrect = result.isCorrect;

      setTotalAnswered((n) => n + 1);
      if (isCorrect) setCorrectCount((c) => c + 1);
      setTotalScore(result.score ?? 0);

      if (optionId === null) {
        setCardState('wrong');
        setResultMsg('시간 초과!');
        setChoiceStates(question.choices.map(() => 'dim'));
      } else {
        setChoiceStates(question.choices.map((c) => {
          if (c.id === optionId && isCorrect)  return 'correct';
          if (c.id === optionId && !isCorrect) return 'wrong';
          return 'dim';
        }));
        setCardState(isCorrect ? 'correct' : 'wrong');
        setResultMsg(isCorrect ? '정답이에요! 🎉' : '오답!');
      }

      submitResultRef.current = { hasNext: result.hasNext, nextCurrent: result.nextCurrent };
    } catch {
      setCardState('wrong');
      setResultMsg('오류가 발생했습니다.');
      setChoiceStates(question.choices.map(() => 'dim'));
      setTotalAnswered((n) => n + 1);
      submitResultRef.current = { hasNext: false, nextCurrent: null };
    }
  };

  const handleNext = async () => {
    if (!answered) return;
    const sr = submitResultRef.current;
    if (!sr) return;

    if (!sr.hasNext || sr.nextCurrent === null) {
      setPhase('result');
      return;
    }

    setIsLoadingNext(true);
    await loadQuestion(sr.nextCurrent);
    setIsLoadingNext(false);
  };

  const handleRetry = () => {
    setPhase('loading');
    setQuestionNumber(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setTotalScore(0);
    submitResultRef.current = null;
    loadQuestion(0);
  };

  // ── 로딩 ─────────────────────────────────────────────────────────────────────
  if (phase === 'loading' || !question) {
    return (
      <MobileLayout>
        <div className="flex h-dvh items-center justify-center bg-surface-page">
          <p className="text-text-sub">로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  // ── 결과 화면 ─────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct   = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚';
    const msg   = pct >= 80 ? '훌륭해요!' : pct >= 50 ? '잘 하고 있어요!' : '더 연습이 필요해요!';

    return (
      <MobileLayout>
        <div className="flex flex-col h-dvh bg-surface-page">
          <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/choices')}
                className="text-text-sub bg-transparent border-none cursor-pointer">
                <ChevronLeft size={26} />
              </button>
              <h1 className="text-lg font-bold text-text-main">퀴즈 완료</h1>
            </div>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-[72px]">{emoji}</span>
            <h2 className="text-[28px] font-bold text-text-main">{pct}점</h2>
            <p className="text-base text-text-sub">{msg}</p>

            <div className="w-full rounded-2xl p-5 bg-white" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{correctCount}</p>
                  <p className="text-xs text-text-sub">정답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#f87171' }}>{totalAnswered - correctCount}</p>
                  <p className="text-xs text-text-sub">오답</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#B8860B' }}>{totalScore.toLocaleString()}</p>
                  <p className="text-xs text-text-sub">점수</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button onClick={handleRetry} className="w-full rounded-2xl py-4 text-base font-bold bg-brand-blue text-text-main border-none cursor-pointer">
                다시 풀기
              </button>
              <button onClick={() => navigate('/choices')} className="w-full rounded-2xl py-4 text-base font-semibold bg-surface-muted text-text-main border-none cursor-pointer">
                목록으로 돌아가기
              </button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  // ── 퀴즈 화면 ─────────────────────────────────────────────────────────────────
  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh" style={{ background: '#f8f9ff' }}>

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => navigate('/choices')} aria-label="뒤로가기"
              className="text-text-sub bg-transparent border-none cursor-pointer">
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

            {/* 정답 수 */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
              <Star size={13} color="#B8860B" fill="#B8860B" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#B8860B' }}>{correctCount}</span>
            </div>
          </div>

          {/* 문제 번호 */}
          <div className="flex justify-end mb-1">
            <span style={{ fontSize: 12, color: '#737373' }}>문제 {questionNumber}</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#B8D0FA', borderRadius: 99, width: '100%' }} />
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 flex flex-col justify-center px-5 gap-4">

          {/* 단어 카드 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${question.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={
                cardState === 'correct' ? { opacity: 1, x: 0, scale: [1, 1.04, 1] } :
                cardState === 'wrong'   ? { opacity: 1, x: [0, -6, 6, -5, 5, 0] } :
                                          { opacity: 1, x: 0 }
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
                {question.question}
              </p>
              {resultMsg && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 13, fontWeight: 700, marginTop: 2, color: cardState === 'correct' ? '#16a34a' : '#dc2626' }}
                >
                  {resultMsg}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 보기 4개 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`choices-${question.id}`}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {question.choices.map((choice, i) => {
                const state = choiceStates[i];
                return (
                  <motion.button
                    key={choice.id}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handlePick(choice.id)}
                    disabled={answered}
                    className="w-full flex items-center gap-3 rounded-2xl text-left"
                    style={{
                      padding: '14px 16px', cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.2s', border: 'none', ...getChoiceStyle(state),
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0 rounded-xl"
                      style={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, transition: 'all 0.2s', ...getBadgeStyle(state) }}
                    >
                      {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : CHOICE_LABELS[i]}
                    </span>
                    <span style={{ flex: 1, fontSize: 16, color: '#1c1c1c', fontWeight: state === 'correct' || state === 'wrong' ? 700 : 500 }}>
                      {choice.text}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 하단 버튼 */}
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          {!answered && timeItems.some(i => i.count > 0) && (
            <div className="flex gap-2 mb-3">
              {timeItems.filter(i => i.count > 0).map(item => (
                <button
                  key={item.item.itemId}
                  onClick={() => handleUseTimeItem(item)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: '#fff3f3', border: '1px solid #fca5a5', color: '#dc2626' }}
                >
                  <Clock size={13} />
                  +{item.item.itemType === 'CHOICE_TIME_10' ? 10 : 30}초
                  <span style={{ background: '#f87171', color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: 10 }}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleNext}
            disabled={!answered || isLoadingNext}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              background: answered && !isLoadingNext ? '#B8D0FA' : '#e5e7eb',
              color: answered && !isLoadingNext ? '#1c1c1c' : '#9ca3af',
              fontSize: 16, fontWeight: 700, border: 'none',
              cursor: answered && !isLoadingNext ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoadingNext ? '로딩 중...' : '다음 문제'}
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </MobileLayout>
  );
}
