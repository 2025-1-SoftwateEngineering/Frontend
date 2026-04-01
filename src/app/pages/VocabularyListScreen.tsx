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
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    vocaApi.getBooks().then(setBooks).finally(() => setLoading(false));
  }, []);

  const categoryColors: Record<string, string> = {
    '동사': '#B8D0FA',
    '동사/명사': '#DDDEA5',
    '비즈니스': '#EDE9BF',
  };

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
          총 {books.reduce((a, b) => a + b.words.length, 0)}개의 TOEIC 단어 수록
        </p>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse" style={{ height: 130, background: '#e5e7eb' }} />
          ))
        ) : (
          books.map((book, i) => {
            const { learnedCount, lastScore } = getBookProgress(book.id);
            const progress = Math.round((learnedCount / book.words.length) * 100);

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4"
                style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="px-2.5 py-1 rounded-lg"
                    style={{ fontSize: 11, fontWeight: 600, background: categoryColors[book.category] || '#f3f3f5', color: '#1c1c1c' }}
                  >
                    {book.category}
                  </span>
                  {lastScore !== null && (
                    <span style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600 }}>
                      최근 {lastScore}점
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1c1c1c', marginBottom: 3 }}>{book.title}</h3>
                <p style={{ fontSize: 12, color: '#737373', marginBottom: 12 }}>{book.description}</p>

                <div className="mb-1 flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#737373' }}>암기 진도</span>
                  <span style={{ fontSize: 12, color: '#94B9F3', fontWeight: 600 }}>
                    {learnedCount}/{book.words.length} ({progress}%)
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
                  <span style={{ fontSize: 12, color: '#737373' }}>📚 {book.words.length}개 단어</span>
                  <button
                    onClick={() => navigate(`/vocabulary/${book.id}`)}
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
