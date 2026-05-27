import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MobileLayout } from '../components/MobileLayout';
import { quizApi } from '../../main/features/domain/voca/vocaApi';

interface ClueEntry {
  id:              number;
  word:            string;
  clueDescription: string;
  row:             string;
  col:             string;
  clueType:        'ACROSS' | 'DOWN';
}

let nextId = 1;

function makeEntry(): ClueEntry {
  return { id: nextId++, word: '', clueDescription: '', row: '0', col: '0', clueType: 'ACROSS' };
}

export function CrosswordCreateScreen() {
  const navigate = useNavigate();

  const [solvedCoin,  setSolvedCoin]  = useState('');
  const [entries,     setEntries]     = useState<ClueEntry[]>([makeEntry()]);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');

  // ── 엔트리 조작 ──────────────────────────────────────────────────────────────

  const addEntry = () => {
    if (entries.length >= 20) return;
    setEntries(prev => [...prev, makeEntry()]);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const update = <K extends keyof ClueEntry>(id: number, key: K, value: ClueEntry[K]) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [key]: value } : e));
  };

  const toggleDir = (id: number) => {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, clueType: e.clueType === 'ACROSS' ? 'DOWN' : 'ACROSS' } : e)
    );
  };

  // ── 유효성 ──────────────────────────────────────────────────────────────────

  const isValid = (e: ClueEntry) =>
    e.word.trim() !== '' &&
    e.clueDescription.trim() !== '' &&
    e.row.trim() !== '' &&
    e.col.trim() !== '' &&
    Number(e.row) >= 0 &&
    Number(e.col) >= 0;

  const canSubmit =
    solvedCoin.trim() !== '' &&
    Number(solvedCoin) >= 0 &&
    entries.length >= 1 &&
    entries.every(isValid);

  // ── 제출 ────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await quizApi.createCrossword(
        Number(solvedCoin),
        entries.map(e => ({
          clueType:        e.clueType,
          clueDescription: e.clueDescription.trim(),
          wordStartPoint:  `${e.row.trim()},${e.col.trim()}`,
          word:            e.word.trim().toLowerCase(),
        })),
      );
      navigate('/crosswords');
    } catch {
      setError('생성에 실패했습니다. 단어가 DB에 등록됐는지 확인해 주세요.');
      setSubmitting(false);
    }
  };

  // ── 렌더 ────────────────────────────────────────────────────────────────────

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh" style={{ background: '#f8f9ff' }}>

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/crosswords')}
              className="text-text-sub bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-text-main">십자말풀이 생성</h1>
              <p className="text-[12px] text-text-sub">관리자 전용</p>
            </div>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 flex flex-col gap-5">

          {/* 클리어 코인 */}
          <div
            className="bg-white rounded-2xl px-4 py-4"
            style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <p className="text-[13px] font-semibold text-text-sub mb-2">🪙 클리어 지급 코인</p>
            <input
              type="number"
              min="0"
              value={solvedCoin}
              onChange={e => setSolvedCoin(e.target.value)}
              placeholder="예: 100"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-main outline-none"
              style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
            />
          </div>

          {/* 단서 목록 헤더 */}
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-text-sub">
              🔠 단서 목록 ({entries.length}/20)
            </p>
            <button
              onClick={addEntry}
              disabled={entries.length >= 20}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-transform disabled:opacity-40"
              style={{
                background: '#B8D0FA', color: '#1c1c1c',
                border: 'none', cursor: entries.length >= 20 ? 'not-allowed' : 'pointer',
              }}
            >
              <Plus size={13} />
              단서 추가
            </button>
          </div>

          {/* 단서 카드들 */}
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl px-4 py-4"
                style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                {/* 카드 헤더: 번호 + 방향 토글 + 삭제 */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: '#f3f3f5', color: '#737373' }}
                  >
                    {i + 1}
                  </span>

                  {/* 방향 토글 */}
                  <button
                    onClick={() => toggleDir(entry.id)}
                    className="flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold active:scale-95 transition-transform"
                    style={{
                      background: entry.clueType === 'ACROSS' ? '#EFF6FF' : '#FFF0FA',
                      color:      entry.clueType === 'ACROSS' ? '#2563EB' : '#9333EA',
                      border:     `1px solid ${entry.clueType === 'ACROSS' ? '#BFDBFE' : '#E9D5FF'}`,
                    }}
                  >
                    {entry.clueType === 'ACROSS' ? '→ 가로' : '↓ 세로'}
                  </button>

                  <div className="flex-1" />

                  {/* 삭제 */}
                  <button
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length <= 1}
                    className="flex-shrink-0 active:scale-95 transition-transform disabled:opacity-30"
                    style={{ background: 'none', border: 'none', cursor: entries.length <= 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <Trash2 size={16} color="#f87171" />
                  </button>
                </div>

                {/* 단어 입력 */}
                <div className="mb-2">
                  <label className="text-[11px] text-text-sub font-semibold block mb-1">정답 단어 (영어)</label>
                  <input
                    type="text"
                    value={entry.word}
                    onChange={e => update(entry.id, 'word', e.target.value)}
                    placeholder="예: apple"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-text-main outline-none"
                    style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
                  />
                </div>

                {/* 단서 설명 */}
                <div className="mb-3">
                  <label className="text-[11px] text-text-sub font-semibold block mb-1">단서 설명 (힌트)</label>
                  <input
                    type="text"
                    value={entry.clueDescription}
                    onChange={e => update(entry.id, 'clueDescription', e.target.value)}
                    placeholder="예: 빨갛고 달콤한 과일"
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-text-main outline-none"
                    style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
                  />
                </div>

                {/* 시작 위치 */}
                <div>
                  <label className="text-[11px] text-text-sub font-semibold block mb-1">
                    시작 위치 (0부터 시작)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-text-sub block mb-0.5">행 (세로)</span>
                      <input
                        type="number"
                        min="0"
                        value={entry.row}
                        onChange={e => update(entry.id, 'row', e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-text-main outline-none text-center"
                        style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
                      />
                    </div>
                    <div className="flex items-end pb-2.5 text-text-sub text-sm font-bold">,</div>
                    <div className="flex-1">
                      <span className="text-[10px] text-text-sub block mb-0.5">열 (가로)</span>
                      <input
                        type="number"
                        min="0"
                        value={entry.col}
                        onChange={e => update(entry.id, 'col', e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-text-main outline-none text-center"
                        style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-text-sub mt-1">
                    → 위치: ({entry.row || '?'}, {entry.col || '?'})
                    &nbsp;·&nbsp;
                    {entry.clueType === 'ACROSS' ? `→ 오른쪽으로 ${entry.word.length || '?'}칸` : `↓ 아래로 ${entry.word.length || '?'}칸`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 설명 박스 */}
          <div
            className="rounded-xl px-4 py-3"
            style={{ background: '#EDE9BF40', border: '1px solid #EDE9BF' }}
          >
            <p className="text-xs text-text-sub leading-relaxed">
              <span className="font-semibold" style={{ color: '#2563EB' }}>→ 가로</span>: 지정 위치에서 오른쪽으로 단어 배치<br />
              <span className="font-semibold" style={{ color: '#9333EA' }}>↓ 세로</span>: 지정 위치에서 아래쪽으로 단어 배치<br />
              <span className="font-semibold text-text-main">정답 단어</span>는 DB에 등록된 영단어여야 합니다.
            </p>
          </div>

          {/* 에러 */}
          {error && (
            <p className="text-sm font-semibold text-center" style={{ color: '#f87171' }}>{error}</p>
          )}
        </div>

        {/* 하단 생성 버튼 */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white"
          style={{ borderTop: '1px solid #e5e7eb' }}
        >
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-bold active:scale-95 transition-transform"
            style={{
              background: canSubmit && !submitting ? '#B8D0FA' : '#e5e7eb',
              color:      canSubmit && !submitting ? '#1c1c1c'  : '#9ca3af',
              border: 'none',
              cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : '생성하기'}
          </button>
        </div>

      </div>
    </MobileLayout>
  );
}
