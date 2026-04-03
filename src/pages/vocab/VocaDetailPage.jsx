import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVoca } from '../../context/VocaContext';
import BackHeader from '../../components/common/BackHeader';

const PAGE_SIZE = 10;

export default function VocaDetailPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getVocaBook } = useVoca();
  const [page, setPage] = useState(0);

  const book = getVocaBook(bookId);

  if (!book) {
    return (
      <div className="flex flex-col min-h-full bg-white">
        <BackHeader title="단어장" />
        <div className="flex items-center justify-center flex-1">
          <p className="text-sm text-app-gray">단어장을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(book.words.length / PAGE_SIZE);
  const pageWords = book.words.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <BackHeader
        title={book.title}
        rightElement={
          user?.isAdmin ? (
            <button
              onClick={() => navigate(`/voca/${book.id}/edit`)}
              className="text-xs font-bold text-primary-dark"
            >
              편집
            </button>
          ) : null
        }
      />

      <div className="flex flex-col gap-4 px-5 py-5 flex-1">
        {/* 단어 목록 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-app-black">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, book.words.length)}번
            </p>
            <span className="text-xs text-app-gray">총 {book.words.length}개</span>
          </div>

          {pageWords.map((word, idx) => (
            <div
              key={word.id}
              className={`px-4 py-4 flex gap-4 items-start ${
                idx < pageWords.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="text-xs text-app-gray w-6 flex-shrink-0 mt-0.5 text-right">
                {page * PAGE_SIZE + idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-app-black text-sm">{word.word}</p>
                <p className="text-xs text-app-gray mt-0.5">{word.meaning}</p>
                {word.example && (
                  <p className="text-xs text-accent mt-1 italic leading-relaxed">{word.example}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  page === i
                    ? 'bg-primary-dark text-white'
                    : 'border border-gray-200 text-app-gray'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-6 flex gap-3 bg-white border-t border-gray-100 pt-4">
        <button
          onClick={() => navigate(`/voca/${book.id}/memorize`)}
          className="flex-1 py-3.5 rounded-xl border-2 border-primary-dark text-sm font-bold text-primary-dark active:bg-primary/10"
        >
          암기하기
        </button>
        <button
          onClick={() => navigate(`/voca/${book.id}/test`)}
          className="flex-1 py-3.5 rounded-xl bg-primary-dark text-sm font-bold text-white shadow-sm shadow-primary-dark/20 active:opacity-80"
        >
          테스트하기
        </button>
      </div>
    </div>
  );
}
