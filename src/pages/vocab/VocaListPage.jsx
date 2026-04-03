import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVoca } from '../../context/VocaContext';

export default function VocaListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vocaBooks } = useVoca();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white px-6 pt-14 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-app-black">단어장</h1>
            <p className="text-sm text-app-gray mt-0.5">학습할 단어장을 선택하세요.</p>
          </div>
          {user?.isAdmin && (
            <button
              onClick={() => navigate('/voca/new')}
              className="flex items-center gap-1.5 bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl active:opacity-80"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
              단어장 추가
            </button>
          )}
        </div>
        {!user?.isAdmin && (
          <button
            onClick={() => navigate('/voca/new')}
            className="mt-3 text-xs text-primary-dark font-semibold underline"
          >
            + 단어장 추가하기
          </button>
        )}
      </div>

      {/* 단어장 목록 */}
      <div className="flex flex-col gap-4 px-5 py-5">
        {vocaBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm text-app-gray">단어장이 없습니다.</p>
          </div>
        ) : (
          vocaBooks.map((book) => {
            const pct = book.totalWords > 0 ? Math.round((book.learnedWords / book.totalWords) * 100) : 0;
            return (
              <div key={book.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-bold text-app-black">{book.title}</p>
                    <p className="text-xs text-app-gray mt-0.5 line-clamp-1">{book.description}</p>
                  </div>
                  <span className="text-xs font-bold text-primary-dark flex-shrink-0">{book.totalWords}개</span>
                </div>

                {/* 진도 바 */}
                <div className="mt-3 mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-app-gray">학습 진도</span>
                    <span className="text-xs font-semibold text-primary-dark">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-dark rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-app-gray mt-1">
                    {book.learnedWords} / {book.totalWords} 완료
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/voca/${book.id}`)}
                  className="w-full py-3 bg-primary-dark rounded-xl text-sm font-bold text-white active:opacity-80 transition-all"
                >
                  학습하기
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
