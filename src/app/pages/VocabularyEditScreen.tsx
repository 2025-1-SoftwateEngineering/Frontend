import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Minus, Trash2, Save } from 'lucide-react';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import { ConfirmModal } from '../components/ConfirmModal';
import type { Word } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';

interface WordRow {
  rowId: string;
  word_id?: number;
  english_word: string;
  meaning: string;
}

const makeRow = (): WordRow => ({
  rowId: `row-${Date.now()}-${Math.random()}`,
  english_word: '',
  meaning: '',
});

export function VocabularyEditScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const isEdit = !!bookId && bookId !== 'create';

  const [level, setLevel] = useState(1);
  const [solvedCoin, setSolvedCoin] = useState(0);
  const [rows, setRows] = useState<WordRow[]>([makeRow()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    vocaApi.getBook(Number(bookId))
      .then((book) => {
        setLevel(book.level);
        setSolvedCoin(book.solved_coin);
        setRows(
          book.words.map((w: Word) => ({
            rowId: `row-${w.word_id}`,
            word_id: w.word_id,
            english_word: w.english_word,
            meaning: w.meaning,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [bookId, isEdit]);

  const updateRow = (rowId: string, field: keyof Omit<WordRow, 'rowId' | 'word_id'>, value: string) => {
    setRows((prev) => prev.map((r) => r.rowId === rowId ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows((prev) => [...prev, makeRow()]);

  const removeRow = (rowId: string) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((r) => r.rowId !== rowId);
    });
  };

  const handleSave = async () => {
    setError('');
    if (level < 1) { setError('레벨은 1 이상이어야 합니다.'); return; }

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.english_word.trim() || !r.meaning.trim()) {
        setError(`${i + 1}번 영어 단어와 뜻은 필수 입력 항목입니다.`);
        return;
      }
    }

    const wordList = rows.map((r) => r.english_word.trim().toLowerCase()).filter(Boolean);
    const hasDuplicates = wordList.some((w, i) => wordList.indexOf(w) !== i);
    if (hasDuplicates) {
      setError('중복된 단어가 있습니다. 확인 후 다시 저장해 주세요.');
      return;
    }

    setSaving(true);
    try {
      const newVocaId = isEdit ? Number(bookId) : Date.now();
      const words: Word[] = rows.map((r, i) => ({
        word_id: r.word_id ?? Date.now() + i,
        voca_id: newVocaId,
        english_word: r.english_word.trim(),
        meaning: r.meaning.trim(),
      }));

      if (isEdit) {
        await vocaApi.updateBook(Number(bookId), { level, solved_coin: solvedCoin, words });
      } else {
        await vocaApi.createBook({ level, solved_coin: solvedCoin, words });
      }
      navigate('/vocabulary');
    } catch (e: any) {
      setError(e.message || '저장에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!bookId) return;
    try {
      await vocaApi.deleteBook(Number(bookId));
      navigate('/vocabulary', { replace: true });
    } catch (e: any) {
      setError(e.message || '삭제에 실패했습니다.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 13px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none',
    background: '#fafafa', color: '#1c1c1c', boxSizing: 'border-box',
  };

  const duplicateRowIds = new Set<string>();
  rows.forEach((row, i) => {
    const trimmed = row.english_word.trim().toLowerCase();
    if (!trimmed) return;
    const hasDuplicate = rows.some((other, j) => j !== i && other.english_word.trim().toLowerCase() === trimmed);
    if (hasDuplicate) duplicateRowIds.add(row.rowId);
  });

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#737373' }}>로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/vocabulary')}
              className="text-gray-500 bg-transparent border-none"
              aria-label="Back"
            >
              <ChevronLeft size={26} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>
              {isEdit ? '단어장 편집' : '단어장 만들기'}
            </h1>
            {isEdit && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="ml-auto px-3 py-1.5 rounded-xl"
                style={{ background: '#fff0f0', color: '#d4183d', fontSize: 13, fontWeight: 600, border: '1px solid #fca5a5' }}
              >
                단어장 삭제
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* 단어장 메타 정보 */}
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1c1c1c', marginBottom: 2 }}>단어장 정보</p>
            <div className="flex gap-3">
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#737373', display: 'block', marginBottom: 5 }}>레벨 (level) *</label>
                <input
                  type="number"
                  min={1}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  placeholder="1"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: '#737373', display: 'block', marginBottom: 5 }}>완료 보상 코인 (solved_coin)</label>
                <input
                  type="number"
                  min={0}
                  value={solvedCoin}
                  onChange={(e) => setSolvedCoin(Number(e.target.value))}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1c1c1c' }}>단어 목록 ({rows.length}개)</p>
              <button
                onClick={addRow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
                style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 13, fontWeight: 600 }}
              >
                <Plus size={15} />
                단어 추가
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {rows.map((row, i) => (
                  <motion.div
                    key={row.rowId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl p-4"
                    style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94B9F3' }}>#{i + 1}</span>
                      <button
                        type="button"
                        aria-label="단어 삭제"
                        onClick={() => removeRow(row.rowId)}
                        disabled={rows.length <= 1}
                        className={`flex items-center justify-center rounded-lg active:scale-95 transition-transform w-[30px] h-[30px] border-none ${rows.length <= 1 ? 'bg-[#f0f0f0] text-[#ccc]' : 'bg-[#fff0f0] text-[#d4183d]'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: '#737373', display: 'block', marginBottom: 4 }}>
                          영어 단어 (english_word) *
                        </label>
                        <input
                          value={row.english_word}
                          onChange={(e) => updateRow(row.rowId, 'english_word', e.target.value)}
                          placeholder="예: accomplish"
                          style={{
                            ...inputStyle,
                            border: duplicateRowIds.has(row.rowId) ? '1.5px solid #f87171' : inputStyle.border,
                            background: duplicateRowIds.has(row.rowId) ? '#fff5f5' : inputStyle.background,
                          }}
                        />
                        {duplicateRowIds.has(row.rowId) && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 11, color: '#f87171', marginTop: 4, fontWeight: 600 }}
                          >
                            ⚠️ 중복된 단어입니다
                          </motion.p>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: '#737373', display: 'block', marginBottom: 4 }}>
                          뜻 (meaning) *
                        </label>
                        <input
                          value={row.meaning}
                          onChange={(e) => updateRow(row.rowId, 'meaning', e.target.value)}
                          placeholder="예: 성취하다"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={addRow}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-95 transition-transform"
                style={{ background: '#EDE9BF', color: '#1c1c1c', fontSize: 14, fontWeight: 600, border: 'none' }}
              >
                <Plus size={16} />
                칸 추가
              </button>
              <button
                onClick={() => removeRow(rows[rows.length - 1]?.rowId)}
                disabled={rows.length <= 1}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-95 transition-transform"
                style={{
                  background: rows.length <= 1 ? '#f0f0f0' : '#f3f3f5',
                  color: rows.length <= 1 ? '#ccc' : '#1c1c1c',
                  fontSize: 14, fontWeight: 600, border: 'none',
                }}
              >
                <Minus size={16} />
                칸 줄이기
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 13, color: '#d4183d', textAlign: 'center' }}
            >
              {error}
            </motion.p>
          )}
          <div style={{ height: 16 }} />
        </div>

        {/* Save button */}
        <div className="flex-shrink-0 px-5 py-4" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ background: saving ? '#c8ddf8' : '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
          >
            <Save size={18} />
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>

        <ConfirmModal
          isOpen={showDeleteModal}
          title="단어장 삭제"
          message="정말 이 단어장을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmLabel="삭제"
          cancelLabel="취소"
          confirmColor="#d4183d"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </MobileLayout>
  );
}
