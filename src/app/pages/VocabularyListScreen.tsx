import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook } from '../../main/features/domain/voca/types';

const LEVEL_COLORS: Record<number, string> = {
  1: '#B8D0FA',
  2: '#DDDEA5',
  3: '#EDE9BF',
};

export function VocabularyListScreen() {
  const { currentUser } = useAuth();
  const { getBookProgress } = useProgress();
  const navigate = useNavigate();
  const [books, setBooks] = useState<VocaBook[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.authorize === 'ROLE_ADMIN';

  useEffect(() => {
    vocaApi.getBooks().then(setBooks).finally(() => setLoading(false));
  }, []);

  const totalWords = books.reduce((a, b) => a + b.words.length, 0);

  return (
    <div className="flex flex-col pb-4 min-h-full bg-surface-page">
      <div className="px-5 pt-14 pb-5 bg-white border-b border-surface-lighter">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={22} color="#94B9F3" />
            <h1 className="text-[22px] font-bold text-text-main">단어장</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('/vocabulary/create')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl active:scale-95 transition-transform bg-brand-blue text-text-main text-[13px] font-semibold"
            >
              <Plus size={16} />
              단어장 추가
            </button>
          )}
        </div>
        {!isAdmin && (
          <button
            onClick={() => alert('단어장 추가는 관리자만 가능합니다.')}
            className="text-[13px] text-brand-blue-dark bg-transparent border-0 mt-1.5 underline p-0"
          >
            + 단어장 추가하기
          </button>
        )}
        <p className="text-[13px] text-text-sub mt-1">
          총 {totalWords}개의 TOEIC 단어 수록
        </p>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse h-[130px] bg-[#e5e7eb]" />
          ))
        ) : (
          books.map((book, i) => {
            const { learnedCount, lastScore } = getBookProgress(book.voca_id);
            const progress = book.words.length > 0
              ? Math.round((learnedCount / book.words.length) * 100)
              : 0;
            const levelColor = LEVEL_COLORS[book.level] || '#f3f3f5';

            return (
              <motion.div
                key={book.voca_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-text-main"
                    style={{ background: levelColor }}
                  >
                    Lv.{book.level}
                  </span>
                  {lastScore !== null && (
                    <span className="text-xs text-brand-blue-dark font-semibold">
                      최근 {lastScore}점
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-text-main mb-0.5">
                  레벨 {book.level} 단어장 #{book.voca_id}
                </h3>
                <p className="text-xs text-text-sub mb-3">
                  완료 보상 🪙 {book.solved_coin} 코인 · {book.words.length}개 단어
                </p>

                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-text-sub">암기 진도</span>
                  <span className="text-xs text-brand-blue-dark font-semibold">
                    {learnedCount}/{book.words.length} ({progress}%)
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
                  <span className="text-xs text-text-sub">📚 {book.words.length}개 단어</span>
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
    </div>
  );
}
