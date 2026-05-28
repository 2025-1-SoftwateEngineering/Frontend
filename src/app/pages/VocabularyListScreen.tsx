import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook } from '../../main/features/domain/voca/types';
import { ConfirmModal } from '../components/ConfirmModal';

function parseVocaDesc(desc?: string) {
  const parts = (desc ?? '').split('|||');
  if (parts.length === 3) return { name: parts[0], category: parts[1], description: parts[2] };
  return { name: desc || '단어장', category: '', description: '' };
}

const CATEGORY_COLORS = [
  'bg-brand-blue text-text-main',
  'bg-brand-beige text-text-main',
  'bg-brand-peach text-text-main',
  'bg-brand-yellow text-text-main',
  'bg-[#d4e8d4] text-text-main',
];

function getCategoryColor(cat: string) {
  if (!cat) return CATEGORY_COLORS[0];
  let hash = 0;
  for (const c of cat) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

export function VocabularyListScreen() {
  const { currentUser } = useAuth();
  const { getBookProgress } = useProgress();
  const navigate = useNavigate();
  const [books, setBooks] = useState<VocaBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const isAdmin = currentUser?.authorize === 'ROLE_ADMIN';

  const [deleteError, setDeleteError] = useState('');

  const handleDeleteBook = async () => {
    if (deleteTarget === null) return;
    try {
      await vocaApi.deleteBook(deleteTarget);
      setBooks((prev) => prev.filter((b) => b.voca_id !== deleteTarget));
      setDeleteTarget(null);
    } catch (e: any) {
      setDeleteTarget(null);
      setDeleteError(e.message || '삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    vocaApi.getBooks().then(setBooks).finally(() => setLoading(false));
  }, []);

  const totalWords = books.reduce((a, b) => a + (b.wordCount ?? b.words.length), 0);

  return (
    <div className="flex flex-col pb-4 min-h-full bg-surface-page">
      <div className="px-5 pt-14 pb-5 bg-white border-b border-surface-lighter">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={22} color="#94B9F3" />
            <h1 className="text-[22px] font-bold text-text-main">단어장</h1>
          </div>
          {isAdmin ? (
            <button
              onClick={() => navigate('/vocabulary/create')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl active:scale-95 transition-transform bg-brand-blue text-text-main text-[13px] font-semibold"
            >
              <Plus size={16} />
              단어장 추가
            </button>
          ) : (
            <button
              onClick={() => alert('단어장 추가는 관리자만 가능합니다.')}
              className="text-[13px] text-brand-blue-dark bg-transparent border-0 mt-1.5 underline p-0"
            >
              + 단어장 추가하기
            </button>
          )}
        </div>
        <p className="text-[13px] text-text-sub mt-1">
          총 {totalWords}개의 TOEIC 단어 수록
        </p>
      </div>

      {deleteError && (
        <div className="px-5 pt-3">
          <p
            className="text-[13px] text-center rounded-xl py-2 px-3"
            style={{ color: '#d4183d', background: '#fef2f2' }}
            onClick={() => setDeleteError('')}
          >
            {deleteError}
          </p>
        </div>
      )}

      <div className="px-5 pt-5 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse h-[150px] bg-[#e5e7eb]" />
          ))
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-[48px]">📚</span>
            <p className="text-[15px] text-text-sub">등록된 단어장이 없습니다.</p>
          </div>
        ) : (
          books.map((book, i) => {
            const wordCount = book.wordCount ?? book.words.length;
            const { learnedCount, lastScore } = getBookProgress(book.voca_id);
            const progress = wordCount > 0 ? Math.round((learnedCount / wordCount) * 100) : 0;
            const { name, category, description } = parseVocaDesc(book.description);
            const categoryColor = getCategoryColor(category);

            return (
              <motion.div
                key={book.voca_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${category ? categoryColor : 'bg-brand-blue text-text-main'}`}>
                    {category || `#${book.voca_id}`}
                  </span>
                  {lastScore !== null && (
                    <span className="text-xs text-brand-blue-dark font-semibold">
                      최근 {lastScore}점
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-text-main mb-0.5">{name}</h3>
                {description && (
                  <p className="text-xs text-text-sub mb-2 leading-relaxed">{description}</p>
                )}

                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-text-sub">암기 진도</span>
                  <span className="text-xs text-brand-blue-dark font-semibold">
                    {learnedCount}/{wordCount} ({progress}%)
                  </span>
                </div>
                <div className="bg-surface-lighter rounded-full h-1.5 overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                    className={`h-full rounded-full ${progress > 50 ? 'bg-brand-blue-dark' : 'bg-brand-blue'}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-sub">📚 {wordCount}개 단어</span>
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(book.voca_id); }}
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-transparent border-0 text-destructive cursor-pointer active:scale-95 transition-transform"
                      aria-label="단어장 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/vocabulary/${book.voca_id}`)}
                    className="ml-auto flex items-center gap-1 px-4 py-2 rounded-xl active:scale-95 transition-transform bg-brand-blue text-text-main text-[13px] font-semibold"
                  >
                    학습하기
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="단어장을 삭제하시겠습니까?"
        message="삭제하면 단어장과 모든 단어가 영구적으로 제거됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmColor="#d4183d"
        onConfirm={handleDeleteBook}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
