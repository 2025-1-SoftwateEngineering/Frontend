import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoca } from '../../context/VocaContext';

export default function WordMemorizePage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getVocaBook } = useVoca();
  const book = getVocaBook(bookId);

  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  // 스와이프 처리
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // 가로 스와이프 우선 (dy < 50)
    if (dy < 50 && Math.abs(dx) > 60) {
      if (dx > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-app-gray">단어장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const words = book.words;
  const word = words[current];

  const handleNext = () => {
    if (current + 1 >= words.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setRevealed(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setRevealed(false);
    }
  };

  if (finished) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen bg-white px-6 gap-6 animate-fade-up">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-app-black">암기 완료! 🎉</p>
          <p className="text-sm text-app-gray mt-2">
            {words.length}개 단어를 모두 확인했습니다.
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => { setCurrent(0); setRevealed(false); setFinished(false); }}
            className="w-full py-3.5 rounded-xl border-2 border-primary-dark text-sm font-bold text-primary-dark"
          >
            처음부터 다시
          </button>
          <button
            onClick={() => navigate(`/voca/${bookId}/test`)}
            className="w-full py-3.5 rounded-xl bg-primary-dark text-sm font-bold text-white"
          >
            테스트하기
          </button>
          <button
            onClick={() => navigate(`/voca/${bookId}`)}
            className="w-full py-3.5 rounded-xl bg-gray-100 text-sm font-bold text-app-gray"
          >
            단어장으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-container flex flex-col min-h-screen bg-gray-50 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 상단 */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1 text-app-black">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-bold text-app-gray">{current + 1} / {words.length}</span>
        <div className="w-8" />
      </div>

      {/* 진행 바 */}
      <div className="w-full h-1.5 bg-primary/15">
        <div
          className="h-full bg-primary-dark transition-all duration-300"
          style={{ width: `${((current + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* 카드 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5">
        {/* 단어 카드 */}
        <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-8 flex flex-col items-center gap-3">
            <p className="text-xs text-app-gray font-medium tracking-widest uppercase">Word</p>
            <p className="text-3xl font-black text-app-black text-center">{word.word}</p>
            {word.example && (
              <p className="text-xs text-accent text-center italic mt-1 leading-relaxed">{word.example}</p>
            )}
          </div>

          {/* 가림막 / 뜻 영역 */}
          <div
            onClick={() => setRevealed((r) => !r)}
            className={`px-8 py-6 border-t border-gray-100 flex flex-col items-center gap-2 cursor-pointer transition-all active:opacity-80 ${
              revealed ? 'bg-primary/10' : 'bg-gray-100'
            }`}
          >
            {revealed ? (
              <>
                <p className="text-xs text-primary-dark font-semibold tracking-wider uppercase mb-1">Meaning</p>
                <p className="text-lg font-bold text-app-black text-center animate-fade-in">{word.meaning}</p>
                <p className="text-xs text-app-gray mt-1">터치하면 다시 가려집니다</p>
              </>
            ) : (
              <>
                <div className="w-16 h-2 bg-gray-300 rounded-full mb-1" />
                <div className="w-10 h-2 bg-gray-200 rounded-full" />
                <p className="text-xs text-app-gray mt-2">터치하여 뜻 확인</p>
              </>
            )}
          </div>
        </div>

        {/* 스와이프 안내 */}
        <p className="text-xs text-app-gray text-center">← 이전  |  다음 →  (스와이프)</p>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-6 flex gap-3 bg-white border-t border-gray-100 pt-4">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-app-gray disabled:opacity-30 active:bg-gray-50"
        >
          ← 이전
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3.5 rounded-xl bg-primary-dark text-sm font-bold text-white active:opacity-80"
        >
          {current + 1 >= words.length ? '완료' : '다음 →'}
        </button>
      </div>
    </div>
  );
}
