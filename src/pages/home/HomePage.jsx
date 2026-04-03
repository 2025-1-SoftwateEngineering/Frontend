import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVoca } from '../../context/VocaContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vocaBooks } = useVoca();

  const totalWords = vocaBooks.reduce((sum, b) => sum + b.totalWords, 0);
  const learnedWords = vocaBooks.reduce((sum, b) => sum + b.learnedWords, 0);
  const progressPct = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-primary px-6 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-dark opacity-30" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white opacity-10" />
        <p className="text-sm text-app-black/60 font-medium relative z-10">{today}</p>
        <h1 className="text-xl font-black text-app-black mt-1 relative z-10">
          안녕하세요, {user?.nickname}님! 👋
        </h1>
        <p className="text-sm text-app-black/60 mt-1 relative z-10">오늘도 단어 공부 시작해볼까요?</p>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5">
        {/* 전체 학습 현황 카드 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">전체 학습 현황</p>
            <span className="text-xs text-primary-dark font-semibold">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-dark rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-app-gray">학습 완료 {learnedWords}개</span>
            <span className="text-xs text-app-gray">전체 {totalWords}개</span>
          </div>
        </div>

        {/* 레벨 & 경험치 카드 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-md shadow-primary-dark/20 flex-shrink-0">
              <span className="text-xl font-black text-white">{user?.level}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold text-app-black">Lv. {user?.level}</p>
                <span className="text-xs text-app-gray">{user?.exp} / {user?.maxExp} XP</span>
              </div>
              <div className="w-full h-2 bg-yellow-pale rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-light rounded-full"
                  style={{ width: `${Math.round((user?.exp / user?.maxExp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 단어장 바로가기 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">내 단어장</p>
            <button onClick={() => navigate('/voca')} className="text-xs text-primary-dark font-semibold">
              전체 보기 →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {vocaBooks.slice(0, 2).map((book) => {
              const pct = book.totalWords > 0 ? Math.round((book.learnedWords / book.totalWords) * 100) : 0;
              return (
                <button
                  key={book.id}
                  onClick={() => navigate(`/voca/${book.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:opacity-80 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.8} className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-app-black truncate">{book.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-dark rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-app-gray flex-shrink-0">{pct}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 학습 시작 CTA */}
        <button
          onClick={() => navigate('/voca')}
          className="bg-primary-dark text-white rounded-2xl p-5 flex items-center justify-between shadow-md shadow-primary-dark/20 active:opacity-90"
        >
          <div>
            <p className="font-bold text-base">오늘의 학습 시작하기</p>
            <p className="text-xs text-white/70 mt-0.5">단어장에서 학습을 시작해보세요</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
