import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Edit2, Brain, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { useProgress } from '../../main/features/domain/voca/ProgressContext';
import { vocaApi } from '../../main/features/domain/voca/vocaApi';
import type { VocaBook } from '../../main/features/domain/voca/types';
import { MobileLayout } from '../components/MobileLayout';
import styles from './VocabularyBookScreen.module.css';

const PAGE_SIZE = 10;

export function VocabularyBookScreen() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getBookProgress } = useProgress();
  const [book, setBook] = useState<VocaBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const isAdmin = currentUser?.authorize === 'ROLE_ADMIN';

  useEffect(() => {
    if (!bookId) return;
    vocaApi.getBook(Number(bookId)).then(setBook).finally(() => setLoading(false));
  }, [bookId]);

  if (!book && loading) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#737373' }}>로딩 중...</p>
        </div>
      </MobileLayout>
    );
  }
  if (!book) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: '#d4183d' }}>단어장을 찾을 수 없습니다.</p>
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

  return (
    <MobileLayout>
      <div className="flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => navigate('/vocabulary')}
              className={styles.backButton}
              title="뒤로 가기"
            >
              <ChevronLeft size={26} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="truncate" style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>
                Lv.{book.level} 단어장 #{book.voca_id}
              </h1>
              <p style={{ fontSize: 12, color: '#737373' }}>
                {book.words.length}개 단어 · 암기 {progress}% · 🪙 {book.solved_coin} 코인
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => navigate(`/vocabulary/${book.voca_id}/edit`)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl"
                style={{ background: '#DDDEA5', color: '#1c1c1c', fontSize: 13, fontWeight: 600 }}
              >
                <Edit2 size={14} />
                편집
              </button>
            )}
          </div>
          <div style={{ background: '#f0f0f0', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#94B9F3', borderRadius: 99,
              transition: 'width 0.8s ease' }} />
          </div>
        </div>

        {/* Word list */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 13, color: '#737373', fontWeight: 600 }}>
              {page + 1}-{Math.min((page + 1) * PAGE_SIZE, book.words.length)} / {book.words.length}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="rounded-full"
                  style={{
                    width: 28, height: 28, fontSize: 12, fontWeight: 600,
                    background: i === page ? '#B8D0FA' : '#f3f3f5',
                    color: i === page ? '#1c1c1c' : '#737373',
                    border: 'none',
                  }}
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
                className="rounded-2xl p-4"
                style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>{word.english_word}</span>
                      <span style={{ fontSize: 11, color: '#94B9F3' }}>#{page * PAGE_SIZE + i + 1}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>{word.meaning}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex-shrink-0 px-4 py-4 flex gap-3" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={() => navigate(`/vocabulary/${book.voca_id}/memorize`)}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform"
            style={{ background: '#EDE9BF', color: '#1c1c1c', fontWeight: 600 }}
          >
            <Brain size={18} />
            암기하기
          </button>
          <button
            onClick={() => navigate(`/vocabulary/${book.voca_id}/test`)}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform"
            style={{ background: '#B8D0FA', color: '#1c1c1c', fontWeight: 600 }}
          >
            <ClipboardCheck size={18} />
            테스트하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
