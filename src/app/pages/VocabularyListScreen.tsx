import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook } from '../../main/features/domain/voca/types';

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

  const totalWords = books.reduce((a, b) => a + (b.wordCount ?? b.words.length), 0);

  return (
    <div className="flex flex-col pb-4" style={{ minHeight: '100%', background: '#f8f9ff' }}>
      <div className="px-5 pt-14 pb-5" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={22} color="#94B9F3" />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1c1c1c' }}>단어장</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate('/vocabulary/create')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl active:scale-95 transition-transform"
              style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 13, fontWeight: 600 }}
            >
              <Plus size={16} />
              단어장 추가
            </button>
          )}
        </div>
        {!isAdmin && (
          <button
            onClick={() => alert('단어장 추가는 관리자만 가능합니다.')}
            style={{ fontSize: 13, color: '#94B9F3', background: 'none', border: 'none',
              marginTop: 6, textDecoration: 'underline', padding: 0 }}
          >
            + 단어장 추가하기
          </button>
        )}
        <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>
          총 {totalWords}개의 TOEIC 단어 수록
        </p>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse" style={{ height: 130, background: '#e5e7eb' }} />
          ))
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span style={{ fontSize: 48 }}>📚</span>
            <p style={{ fontSize: 15, color: '#737373' }}>등록된 단어장이 없습니다.</p>
          </div>
        ) : (
          books.map((book, i) => {
            const wordCount = book.wordCount ?? book.words.length;
            const { learnedCount, lastScore } = getBookProgress(book.voca_id);
            const progress = wordCount > 0
              ? Math.round((learnedCount / wordCount) * 100)
              : 0;
            const title = book.description ?? `단어장 #${book.voca_id}`;

            return (
              <motion.div
                key={book.voca_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4"
                style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="px-2.5 py-1 rounded-lg"
                    style={{ fontSize: 11, fontWeight: 600, background: '#B8D0FA', color: '#1c1c1c' }}
                  >
                    #{book.voca_id}
                  </span>
                  {lastScore !== null && (
                    <span style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600 }}>
                      최근 {lastScore}점
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1c1c1c', marginBottom: 3 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 12, color: '#737373', marginBottom: 12 }}>
                  {book.solved_coin > 0 && `완료 보상 🪙 ${book.solved_coin} 코인 · `}{wordCount}개 단어
                </p>

                <div className="mb-1 flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#737373' }}>암기 진도</span>
                  <span style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600 }}>
                    {learnedCount}/{wordCount} ({progress}%)
                  </span>
                </div>
                <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 12 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                    style={{ height: '100%', background: progress > 50 ? '#94B9F3' : '#B8D0FA', borderRadius: 99 }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: '#737373' }}>📚 {wordCount}개 단어</span>
                  <button
                    onClick={() => navigate(`/vocabulary/${book.voca_id}`)}
                    className="ml-auto flex items-center gap-1 px-4 py-2 rounded-xl active:scale-95 transition-transform"
                    style={{ background: '#B8D0FA', color: '#1c1c1c', fontSize: 13, fontWeight: 600 }}
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
