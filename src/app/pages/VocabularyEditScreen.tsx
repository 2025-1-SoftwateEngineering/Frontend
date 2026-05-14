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
          <p className="text-text-sub">로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative flex flex-col h-dvh bg-surface-page">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/vocabulary')}
              className="text-text-sub bg-transparent border-0"
              aria-label="Back"
            >
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-lg font-bold text-text-main">
              {isEdit ? '단어장 편집' : '단어장 만들기'}
            </h1>
            {isEdit && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="ml-auto px-3 py-1.5 rounded-xl bg-[#fff0f0] text-destructive text-[13px] font-semibold border border-[#fca5a5]"
              >
                단어장 삭제
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* 단어장 메타 정보 */}
          <div className="rounded-2xl p-4 flex flex-col gap-3 bg-white shadow-sm">
            <p className="text-[13px] font-bold text-text-main mb-0.5">단어장 정보</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-text-sub block mb-1">레벨 (level) *</label>
                <input
                  type="number"
                  min={1}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  placeholder="1"
                  className="w-full px-3 py-[11px] rounded-[10px] border border-[#e5e7eb] text-sm outline-none bg-surface-input text-text-main"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-sub block mb-1">완료 보상 코인 (solved_coin)</label>
                <input
                  type="number"
                  min={0}
                  value={solvedCoin}
                  onChange={(e) => setSolvedCoin(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-[11px] rounded-[10px] border border-[#e5e7eb] text-sm outline-none bg-surface-input text-text-main"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-bold text-text-main">단어 목록 ({rows.length}개)</p>
              <button
                onClick={addRow}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl active:scale-95 transition-transform bg-brand-blue text-text-main text-[13px] font-semibold"
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
                    className="rounded-2xl p-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-brand-blue-dark">#{i + 1}</span>
                      <button
                        type="button"
                        aria-label="단어 삭제"
                        onClick={() => removeRow(row.rowId)}
                        disabled={rows.length <= 1}
                        className={`w-[30px] h-[30px] flex items-center justify-center rounded-lg active:scale-95 transition-transform border-0 ${rows.length <= 1 ? 'bg-surface-lighter text-[#ccc]' : 'bg-[#fff0f0] text-destructive'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[11px] text-text-sub block mb-1">
                          영어 단어 (english_word) *
                        </label>
                        <input
                          value={row.english_word}
                          onChange={(e) => updateRow(row.rowId, 'english_word', e.target.value)}
                          placeholder="예: accomplish"
                          className={`w-full px-3 py-[11px] rounded-[10px] border text-sm outline-none ${duplicateRowIds.has(row.rowId) ? 'border-[#f87171] bg-[#fff5f5]' : 'border-[#e5e7eb] bg-surface-input'} text-text-main`}
                        />
                        {duplicateRowIds.has(row.rowId) && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[11px] text-[#f87171] mt-1 font-semibold"
                          >
                            ⚠️ 중복된 단어입니다
                          </motion.p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] text-text-sub block mb-1">
                          뜻 (meaning) *
                        </label>
                        <input
                          value={row.meaning}
                          onChange={(e) => updateRow(row.rowId, 'meaning', e.target.value)}
                          placeholder="예: 성취하다"
                          className="w-full px-3 py-[11px] rounded-[10px] border border-[#e5e7eb] text-sm outline-none bg-surface-input text-text-main"
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
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-95 transition-transform bg-brand-beige text-text-main text-sm font-semibold border-0"
              >
                <Plus size={16} />
                칸 추가
              </button>
              <button
                onClick={() => removeRow(rows[rows.length - 1]?.rowId)}
                disabled={rows.length <= 1}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-95 transition-transform text-sm font-semibold border-0 ${rows.length <= 1 ? 'bg-surface-lighter text-[#ccc]' : 'bg-surface-muted text-text-main'}`}
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
              className="text-[13px] text-destructive text-center"
            >
              {error}
            </motion.p>
          )}
          <div className="h-4" />
        </div>

        {/* Save button */}
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform text-base font-bold text-text-main ${saving ? 'bg-brand-blue-dim' : 'bg-brand-blue'}`}
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
