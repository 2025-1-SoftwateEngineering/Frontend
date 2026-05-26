import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { quizApi } from '../../main/features/domain/voca/vocaApi';

interface ChoiceEntry {
  id:     number;
  word:   string;
  isWord: boolean;
}

let nextId = 1;

export function ChoiceCreateScreen() {
  const navigate = useNavigate();

  const [solvedCoin, setSolvedCoin]   = useState('');
  const [entries, setEntries]         = useState<ChoiceEntry[]>([{ id: nextId++, word: '', isWord: true }]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');

  const addEntry = () => {
    if (entries.length >= 30) return;
    setEntries((prev) => [...prev, { id: nextId++, word: '', isWord: true }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateWord = (id: number, word: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, word } : e));
  };

  const toggleIsWord = (id: number) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isWord: !e.isWord } : e));
  };

  const canSubmit =
    solvedCoin.trim() !== '' &&
    Number(solvedCoin) >= 0 &&
    entries.every((e) => e.word.trim() !== '');

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await quizApi.createChoiceQuiz(
        Number(solvedCoin),
        entries.map((e) => ({ word: e.word.trim(), isWord: e.isWord })),
      );
      navigate('/choices');
    } catch {
      setError('생성에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh" style={{ background: '#f8f9ff' }}>

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/choices')}
              className="text-text-sub bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-text-main">사지선다 생성</h1>
              <p className="text-[12px] text-text-sub">관리자 전용</p>
            </div>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 flex flex-col gap-5">

          {/* 지급 코인 */}
          <div className="bg-white rounded-2xl px-4 py-4" style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <p className="text-[13px] font-semibold text-text-sub mb-2">🪙 클리어 지급 코인</p>
            <input
              type="number"
              min="0"
              value={solvedCoin}
              onChange={(e) => setSolvedCoin(e.target.value)}
              placeholder="예: 100"
              className="w-full rounded-xl px-4 py-3 text-sm text-text-main outline-none"
              style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
            />
          </div>

          {/* 문항 목록 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-text-sub">📝 문항 목록 ({entries.length}/30)</p>
              <button
                onClick={addEntry}
                disabled={entries.length >= 30}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-transform disabled:opacity-40"
                style={{ background: '#B8D0FA', color: '#1c1c1c', border: 'none', cursor: entries.length >= 30 ? 'not-allowed' : 'pointer' }}
              >
                <Plus size={13} />
                문항 추가
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  {/* 번호 */}
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: '#f3f3f5', color: '#737373' }}
                  >
                    {i + 1}
                  </span>

                  {/* 단어 입력 */}
                  <input
                    type="text"
                    value={entry.word}
                    onChange={(e) => updateWord(entry.id, e.target.value)}
                    placeholder="영단어 또는 뜻 입력"
                    className="flex-1 text-sm text-text-main outline-none bg-transparent"
                    style={{ minWidth: 0 }}
                  />

                  {/* 출제 방식 토글 */}
                  <button
                    onClick={() => toggleIsWord(entry.id)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-95 transition-transform"
                    style={{
                      background: entry.isWord ? '#EFF6FF' : '#FFF8E1',
                      color:      entry.isWord ? '#2563EB' : '#B8860B',
                      border:     `1px solid ${entry.isWord ? '#BFDBFE' : '#FFE082'}`,
                    }}
                  >
                    {entry.isWord ? '단어→뜻' : '뜻→단어'}
                  </button>

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
              ))}
            </div>
          </div>

          {/* 출제 방식 설명 */}
          <div className="rounded-xl px-4 py-3" style={{ background: '#EDE9BF40', border: '1px solid #EDE9BF' }}>
            <p className="text-xs text-text-sub leading-relaxed">
              <span className="font-semibold" style={{ color: '#2563EB' }}>단어→뜻</span>: 영어 단어를 보고 뜻 4개 중 고르기<br />
              <span className="font-semibold" style={{ color: '#B8860B' }}>뜻→단어</span>: 한국어 뜻을 보고 단어 4개 중 고르기
            </p>
          </div>

          {/* 에러 */}
          {error && (
            <p className="text-sm font-semibold text-center" style={{ color: '#f87171' }}>{error}</p>
          )}
        </div>

        {/* 하단 버튼 */}
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
