import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import type { VocaBook, Word } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';
import styles from './WordTestScreen.module.css';

type Phase = 'test' | 'result';

export function WordTestScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { addTestResult } = useProgress();

  const [book, setBook] = useState<VocaBook | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<Phase>('test');
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

  const handleNext = () => {
    const newScores = [...scores, isCorrect];
    if (idx < words.length - 1) {
      setScores(newScores);
      setIdx(idx + 1);
      setInput('');
      setChecked(false);
      setIsCorrect(false);
    } else {
      setScores(newScores);
      setPhase('result');
      const score = Math.round((newScores.filter(Boolean).length / words.length) * 100);
      const xpGain = newScores.filter(Boolean).length * 10;
      addTestResult(Number(bookId), { score, total: words.length, date: new Date().toISOString() }, xpGain);
    }
  };

  if (!book || words.length === 0) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#737373' }}>로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (phase === 'result') {
    const correct = scores.filter(Boolean).length;
    const pct = Math.round((correct / words.length) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚';
    const msg = pct >= 80 ? '훌륭해요!' : pct >= 50 ? '잘 하고 있어요!' : '더 연습이 필요해요!';

    return (
      <MobileLayout>
        <div className="flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
          <div className="px-4 pt-12 pb-3 flex items-center" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
            <button type="button" onClick={() => navigate(`/vocabulary/${bookId}`)} className={styles.iconButton} title="뒤로 가기">
              <ChevronLeft size={26} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c', marginLeft: 8 }}>테스트 완료</h1>
          </div>

          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span style={{ fontSize: 72 }}>{emoji}</span>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1c1c1c' }}>{pct}점</h2>
            <p style={{ fontSize: 16, color: '#737373' }}>{msg}</p>

            <div className="w-full rounded-2xl p-5" style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#94B9F3' }}>{correct}</p>
                  <p style={{ fontSize: 12, color: '#737373' }}>정답</p>
                </div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#d4183d' }}>{words.length - correct}</p>
                  <p style={{ fontSize: 12, color: '#737373' }}>오답</p>
                </div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#DDDEA5' }}>+{correct * 10}</p>
                  <p style={{ fontSize: 12, color: '#737373' }}>XP 획득</p>
                </div>
              </div>
            </div>

            {words.some((_, i) => !scores[i]) && (
              <div className="w-full">
                <p style={{ fontSize: 13, fontWeight: 600, color: '#d4183d', marginBottom: 8 }}>틀린 단어 복습</p>
                <div className="flex flex-col gap-2">
                  {words.filter((_, i) => !scores[i]).map((w) => (
                    <div key={w.word_id} className="rounded-xl p-3 flex justify-between" style={{ background: '#fff3f3' }}>
                      <span style={{ fontWeight: 600, color: '#1c1c1c' }}>{w.english_word}</span>
                      <span style={{ color: '#737373', fontSize: 13 }}>{w.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => { setIdx(0); setInput(''); setChecked(false); setScores([]); setPhase('test'); setWords([...words].sort(() => Math.random() - 0.5)); }}
                className="w-full rounded-2xl py-4"
                style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
              >
                다시 테스트하기
              </button>
              <button
                onClick={() => navigate(`/vocabulary/${bookId}`)}
                className="w-full rounded-2xl py-4"
                style={{ background: '#f3f3f5', color: '#1c1c1c', fontSize: 16, fontWeight: 600 }}
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
      <div className="flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-2 mb-3">
            <button type="button" onClick={() => navigate(`/vocabulary/${bookId}`)} className={styles.iconButton} title="뒤로 가기">
              <ChevronLeft size={26} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>단어 테스트</h1>
            <span className="ml-auto" style={{ fontSize: 13, color: '#737373' }}>{idx + 1} / {words.length}</span>
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((idx + (checked ? 1 : 0)) / words.length) * 100}%` }}
              style={{ height: '100%', background: '#B8D0FA', borderRadius: 99 }}
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
              className="rounded-3xl p-6 flex flex-col gap-3"
              style={{ background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            >
              <p style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>뜻</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#1c1c1c', lineHeight: 1.4 }}>{current?.meaning}</p>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>영어 단어를 입력하세요</p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (checked ? handleNext() : handleCheck())}
                placeholder="영어 스펠링 입력..."
                disabled={checked}
                style={{
                  flex: 1, padding: '12px 14px', borderRadius: 12,
                  border: checked ? `2px solid ${isCorrect ? '#4ade80' : '#f87171'}` : '1.5px solid #e5e7eb',
                  fontSize: 16, outline: 'none', background: '#fafafa', color: '#1c1c1c',
                }}
              />
              {checked ? (
                isCorrect
                  ? <CheckCircle size={28} color="#4ade80" style={{ alignSelf: 'center', flexShrink: 0 }} />
                  : <XCircle size={28} color="#f87171" style={{ alignSelf: 'center', flexShrink: 0 }} />
              ) : null}
            </div>
            {checked && !isCorrect && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 14, color: '#94B9F3', marginTop: 8, fontWeight: 600 }}>
                정답: <span style={{ color: '#1c1c1c' }}>{current?.english_word}</span>
              </motion.p>
            )}
            {checked && isCorrect && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 14, color: '#4ade80', marginTop: 8, fontWeight: 600 }}>
                정답입니다! 🎉
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-4" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!input.trim()}
              className="w-full rounded-2xl py-4 active:scale-95 transition-transform"
              style={{ background: input.trim() ? '#B8D0FA' : '#e5e7eb', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
            >
              확인하기
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full rounded-2xl py-4 active:scale-95 transition-transform"
              style={{ background: '#94B9F3', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
            >
              {idx < words.length - 1 ? '다음 단어 →' : '결과 보기'}
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
