import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Edit2, Brain, ClipboardCheck, Gamepad2, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

function parseVocaDesc(desc?: string) {
  const parts = (desc ?? '').split('|||');
  if (parts.length === 3) return parts[0];
  return desc || '';
}
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';

const PAGE_SIZE = 10;

export function VocabularyBookScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getBookProgress } = useProgress();
  const [book, setBook] = useState<VocaBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [confirmDeleteBook, setConfirmDeleteBook] = useState(false);
  const [deleteWordTarget, setDeleteWordTarget] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const isAdmin = currentUser?.authorize === 'ROLE_ADMIN';

  const handleDeleteBook = async () => {
    if (!book) return;
    try {
      await vocaApi.deleteBook(book.voca_id);
      navigate('/vocabulary', { replace: true });
    } catch (e: any) {
      setConfirmDeleteBook(false);
      setDeleteError(e.message || '삭제에 실패했습니다.');
    }
  };

  const handleDeleteWord = async () => {
    if (deleteWordTarget === null || !book) return;
    try {
      await vocaApi.deleteWord(deleteWordTarget);
      const updated = { ...book, words: book.words.filter((w) => w.word_id !== deleteWordTarget) };
      setBook(updated);
      const newTotalPages = Math.ceil(updated.words.length / PAGE_SIZE);
      if (page >= newTotalPages && newTotalPages > 0) setPage(newTotalPages - 1);
      setDeleteWordTarget(null);
    } catch (e: any) {
      setDeleteWordTarget(null);
      setDeleteError(e.message || '단어 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (!bookId) return;
    vocaApi.getBook(Number(bookId)).then(setBook).finally(() => setLoading(false));
  }, [bookId]);

  if (!book && loading) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-sub">로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }
  if (!book) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">단어장을 찾을 수 없습니다.</p>
        </div>
      </MobileLayout>
    );
  }

  const totalPages = Math.ceil(book.words.length / PAGE_SIZE);
  const pageWords = book.words.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const { learnedCount } = getBookProgress(book.voca_id);
  const progress = book.words.length > 0
    ? Math.round((learnedCount / book.words.length) * 100)
    : 0;
  const bookName = parseVocaDesc(book.description);

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2 mb-3">
            <button type="button" onClick={() => navigate('/vocabulary')} className="text-text-sub bg-transparent border-0" aria-label="Back">
              <ChevronLeft size={26} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-lg font-bold text-text-main">
                {bookName || `단어장 #${book.voca_id}`}
              </h1>
              <p className="text-xs text-text-sub">
                {book.words.length}개 단어 · 암기 {progress}% · 🪙 {book.solved_coin} 코인
              </p>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/vocabulary/${book.voca_id}/edit`)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-yellow text-text-main text-[13px] font-semibold"
                >
                  <Edit2 size={14} />
                  편집
                </button>
                <button
                  onClick={() => setConfirmDeleteBook(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-transparent border-0 text-destructive cursor-pointer active:scale-95 transition-transform"
                  aria-label="단어장 삭제"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}
          </div>
          <div className="bg-surface-lighter rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-brand-blue-dark rounded-full transition-[width] duration-[800ms] ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 삭제 오류 */}
        {deleteError && (
          <div className="flex-shrink-0 px-4 pt-2">
            <p
              className="text-[13px] text-center rounded-xl py-2 px-3"
              style={{ color: '#d4183d', background: '#fef2f2' }}
              onClick={() => setDeleteError('')}
            >
              {deleteError}
            </p>
          </div>
        )}

        {/* Word list */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-text-sub font-semibold">
              {page + 1}-{Math.min((page + 1) * PAGE_SIZE, book.words.length)} / {book.words.length}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold border-0 ${i === page ? 'bg-brand-blue text-text-main' : 'bg-surface-muted text-text-sub'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {pageWords.map((word, i) => (
              <motion.div
                key={word.word_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-text-main">{word.english_word}</span>
                      <span className="text-[11px] text-brand-blue-dark">#{page * PAGE_SIZE + i + 1}</span>
                    </div>
                    <p className="text-sm text-text-sub mt-0.5">{word.meaning}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setDeleteWordTarget(word.word_id)}
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-transparent border-0 text-destructive cursor-pointer active:scale-95 transition-transform ml-2 flex-shrink-0"
                      aria-label="단어 삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex-shrink-0 px-4 py-4 flex flex-col gap-2 bg-white border-t border-surface-lighter">
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/vocabulary/${book.voca_id}/memorize`)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform bg-brand-beige text-text-main font-semibold"
            >
              <Brain size={18} />
              암기하기
            </button>
            <button
              onClick={() => navigate(`/vocabulary/${book.voca_id}/test`)}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform bg-brand-blue text-text-main font-semibold"
            >
              <ClipboardCheck size={18} />
              테스트하기
            </button>
          </div>
          <button
            onClick={() => navigate('/minigames')}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform bg-brand-purple text-white font-semibold"
          >
            <Gamepad2 size={18} />
            미니게임
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDeleteBook}
        title="단어장을 삭제하시겠습니까?"
        message="삭제하면 단어장과 모든 단어가 영구적으로 제거됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmColor="#d4183d"
        onConfirm={handleDeleteBook}
        onCancel={() => setConfirmDeleteBook(false)}
      />
      <ConfirmModal
        isOpen={deleteWordTarget !== null}
        title="단어를 삭제하시겠습니까?"
        message="삭제된 단어는 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmColor="#d4183d"
        onConfirm={handleDeleteWord}
        onCancel={() => setDeleteWordTarget(null)}
      />
    </MobileLayout>
  );
}
