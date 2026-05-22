import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { quizApi } from '../../main/features/domain/voca/vocaApi';
import type { CrosswordData, CrosswordClue } from '../../main/features/domain/voca/vocaApi';

type ClueStatus = 'idle' | 'correct' | 'wrong';
type Phase = 'loading' | 'puzzle' | 'complete';

export function CrosswordScreen() {
  const { crosswordId } = useParams<{ crosswordId: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [data, setData] = useState<CrosswordData | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [clueStatuses, setClueStatuses] = useState<Record<number, ClueStatus>>({});
  const [solvedAnswers, setSolvedAnswers] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'ACROSS' | 'DOWN'>('ACROSS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!crosswordId) return;
    quizApi.getCrossword(Number(crosswordId))
      .then((d) => { setData(d); setPhase('puzzle'); })
      .catch(() => setPhase('puzzle'));
  }, [crosswordId]);

  const selectedClue = data?.elements.find((e) => e.id === selectedId) ?? null;
  const solvedCount  = Object.values(clueStatuses).filter((s) => s === 'correct').length;
  const totalClues   = data?.elements.length ?? 0;

  // 그리드 셀 계산
  const { gridCells, clueNumbers, cellSize } = useMemo(() => {
    if (!data) return { gridCells: [], clueNumbers: {}, cellSize: 30 };
    const { N, elements } = data;
    const size = Math.max(20, Math.min(34, Math.floor(296 / N)));

    const cells: { active: boolean; letter: string; highlighted: boolean }[][] =
      Array.from({ length: N }, () =>
        Array.from({ length: N }, () => ({ active: false, letter: '', highlighted: false }))
      );

    const nums: Record<string, number> = {};
    let numCounter = 1;

    for (const elem of elements) {
      const answer = solvedAnswers[elem.id] ?? '';
      const key = `${elem.verticalStartPoint},${elem.horizontalStartPoint}`;
      if (!nums[key]) { nums[key] = numCounter++; }

      for (let k = 0; k < elem.wordLength; k++) {
        const row = elem.clueType === 'DOWN'   ? elem.verticalStartPoint + k   : elem.verticalStartPoint;
        const col = elem.clueType === 'ACROSS' ? elem.horizontalStartPoint + k : elem.horizontalStartPoint;
        if (row < N && col < N) {
          cells[row][col].active = true;
          if (answer[k]) cells[row][col].letter = answer[k].toUpperCase();
        }
      }
    }

    // 선택된 단서 하이라이트
    if (selectedId !== null) {
      const sel = elements.find((e) => e.id === selectedId);
      if (sel) {
        for (let k = 0; k < sel.wordLength; k++) {
          const row = sel.clueType === 'DOWN'   ? sel.verticalStartPoint + k   : sel.verticalStartPoint;
          const col = sel.clueType === 'ACROSS' ? sel.horizontalStartPoint + k : sel.horizontalStartPoint;
          if (row < N && col < N) cells[row][col].highlighted = true;
        }
      }
    }

    return { gridCells: cells, clueNumbers: nums, cellSize: size };
  }, [data, solvedAnswers, selectedId]);

  const handleSelectClue = (clue: CrosswordClue) => {
    if (clueStatuses[clue.id] === 'correct') return;
    setSelectedId(clue.id);
    setInputValue('');
    setActiveTab(clue.clueType);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async () => {
    if (!selectedClue || !crosswordId || !inputValue.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await quizApi.submitCrosswordAnswer(
        Number(crosswordId),
        selectedClue.id,
        inputValue.trim(),
      );
      if (result.isCorrect) {
        setSolvedAnswers((prev) => ({ ...prev, [selectedClue.id]: inputValue.trim() }));
        setClueStatuses((prev) => ({ ...prev, [selectedClue.id]: 'correct' }));
        setInputValue('');
        setSelectedId(null);
        if (!result.hasNext) setPhase('complete');
      } else {
        setClueStatuses((prev) => ({ ...prev, [selectedClue.id]: 'wrong' }));
      }
    } catch {
      // 네트워크 오류 무시
    }
    setIsSubmitting(false);
  };

  const acrossClues = data?.elements.filter((e) => e.clueType === 'ACROSS') ?? [];
  const downClues   = data?.elements.filter((e) => e.clueType === 'DOWN')   ?? [];
  const tabClues    = activeTab === 'ACROSS' ? acrossClues : downClues;

  // ── 로딩 ──────────────────────────────────────────────────────────────────────
  if (phase === 'loading' || !data) {
    return (
      <MobileLayout>
        <div className="flex h-dvh items-center justify-center bg-surface-page">
          <p className="text-text-sub">로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  // ── 완료 화면 ─────────────────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <MobileLayout>
        <div className="flex flex-col h-dvh bg-surface-page">
          <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/crosswords')}
                className="text-text-sub bg-transparent border-none cursor-pointer">
                <ChevronLeft size={26} />
              </button>
              <h1 className="text-lg font-bold text-text-main">퍼즐 완료</h1>
            </div>
          </div>
          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-[72px]">🎉</span>
            <h2 className="text-[26px] font-bold text-text-main">모든 단서를 맞혔어요!</h2>
            <p className="text-base text-text-sub">대단해요!</p>
            <div className="w-full rounded-2xl p-5 bg-white" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{totalClues}</p>
                <p className="text-xs text-text-sub mt-1">단서 풀이 완료</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/crosswords')}
              className="w-full rounded-2xl py-4 text-base font-bold bg-brand-blue text-text-main border-none cursor-pointer"
            >
              목록으로
            </button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  // ── 퍼즐 화면 ─────────────────────────────────────────────────────────────────
  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/crosswords')}
              className="text-text-sub bg-transparent border-none cursor-pointer">
              <ChevronLeft size={26} />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold text-text-main">십자말풀이 #{crosswordId}</h1>
            </div>
            <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>
              {solvedCount} / {totalClues}
            </span>
          </div>
          {/* 진행 바 */}
          <div className="mt-2" style={{ background: '#f0f0f0', borderRadius: 99, height: 5, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: totalClues > 0 ? `${(solvedCount / totalClues) * 100}%` : '0%' }}
              style={{ height: '100%', background: '#4ade80', borderRadius: 99 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pb-32">

          {/* 그리드 */}
          <div className="flex justify-center py-4 px-4">
            <div style={{ display: 'inline-block', border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
              {gridCells.map((row, r) => (
                <div key={r} style={{ display: 'flex' }}>
                  {row.map((cell, c) => {
                    const numKey = `${r},${c}`;
                    const num    = clueNumbers[numKey];
                    return (
                      <div
                        key={c}
                        style={{
                          width:  cellSize,
                          height: cellSize,
                          background: cell.highlighted
                            ? '#BFDBFE'
                            : cell.active ? '#fff' : '#374151',
                          borderRight:  c < (data?.N ?? 0) - 1 ? '1px solid #d1d5db' : 'none',
                          borderBottom: r < (data?.N ?? 0) - 1 ? '1px solid #d1d5db' : 'none',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {cell.active && num && (
                          <span style={{
                            position: 'absolute', top: 1, left: 2,
                            fontSize: Math.max(7, cellSize * 0.25),
                            color: '#6b7280', fontWeight: 600, lineHeight: 1,
                          }}>
                            {num}
                          </span>
                        )}
                        {cell.active && cell.letter && (
                          <span style={{
                            fontSize: Math.max(10, cellSize * 0.45),
                            fontWeight: 700, color: '#1c1c1c',
                          }}>
                            {cell.letter}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 px-4 mb-3">
            {(['ACROSS', 'DOWN'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer ${activeTab === tab ? 'bg-brand-blue text-text-main' : 'bg-surface-muted text-text-sub'}`}
              >
                {tab === 'ACROSS' ? '→ 가로' : '↓ 세로'}
              </button>
            ))}
          </div>

          {/* 단서 목록 */}
          <div className="px-4 flex flex-col gap-2">
            {tabClues.map((clue, i) => {
              const status = clueStatuses[clue.id] ?? 'idle';
              const isSelected = selectedId === clue.id;
              const numKey = `${clue.verticalStartPoint},${clue.horizontalStartPoint}`;
              const num = clueNumbers[numKey] ?? (i + 1);

              return (
                <motion.button
                  key={clue.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={status !== 'correct' ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectClue(clue)}
                  disabled={status === 'correct'}
                  className="w-full flex items-start gap-3 rounded-2xl px-4 py-3 text-left"
                  style={{
                    background: status === 'correct'
                      ? '#f0fdf4'
                      : isSelected ? '#EFF6FF' : '#fff',
                    border: `1.5px solid ${
                      status === 'correct' ? '#4ade80'
                      : isSelected ? '#93C5FD' : '#f0f0f0'
                    }`,
                    cursor: status === 'correct' ? 'default' : 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: status === 'correct' ? '#4ade80' : isSelected ? '#93C5FD' : '#f3f3f5',
                      color: status === 'correct' || isSelected ? '#fff' : '#737373',
                    }}
                  >
                    {status === 'correct' ? <Check size={14} /> : num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${status === 'correct' ? 'text-text-sub line-through' : 'text-text-main'}`}>
                      {clue.clueDescription}
                    </p>
                    <p className="text-xs text-text-sub mt-0.5">{clue.wordLength}글자</p>
                  </div>
                  {status === 'wrong' && (
                    <X size={16} color="#f87171" className="flex-shrink-0 mt-0.5" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 하단 입력창 (단서 선택 시) */}
        {selectedClue && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white"
            style={{ borderTop: '1px solid #e5e7eb', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}
          >
            <p className="text-xs text-text-sub mb-2 truncate">
              <span className="font-semibold text-text-main">
                {selectedClue.clueType === 'ACROSS' ? '→ 가로' : '↓ 세로'}
              </span>
              &nbsp;·&nbsp;{selectedClue.clueDescription}
            </p>
            {clueStatuses[selectedClue.id] === 'wrong' && (
              <p className="text-xs font-semibold mb-2" style={{ color: '#f87171' }}>
                오답입니다. 다시 시도해보세요.
              </p>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder={`${selectedClue.wordLength}글자 영단어 입력`}
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none bg-surface-page text-text-main"
                style={{
                  border: '1.5px solid #e5e7eb',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isSubmitting}
                className="px-5 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: inputValue.trim() && !isSubmitting ? '#B8D0FA' : '#e5e7eb',
                  color: inputValue.trim() && !isSubmitting ? '#1c1c1c' : '#9ca3af',
                  border: 'none', cursor: inputValue.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                  flexShrink: 0,
                }}
              >
                {isSubmitting ? '...' : '제출'}
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </MobileLayout>
  );
}
