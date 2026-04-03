import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoca } from '../../context/VocaContext';

export default function WordTestPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getVocaBook } = useVoca();
  const book = getVocaBook(bookId);

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [current, submitted]);

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-app-gray">단어장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const words = book.words;
  const word = words[current];
  const progress = ((current + (submitted ? 1 : 0)) / words.length) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    const isCorrect = answer.trim().toLowerCase() === word.word.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    setResults((prev) => [...prev, { word: word.word, meaning: word.meaning, answer: answer.trim(), correct: isCorrect }]);
  };

  const handleNext = () => {
    if (current + 1 >= words.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setAnswer('');
      setSubmitted(false);
      setCorrect(null);
    }
  };

  const correctCount = results.filter((r) => r.correct).length;

  if (finished) {
    return (
      <div className="app-container flex flex-col min-h-screen bg-white px-6 py-10 animate-fade-up">
        <div className="flex flex-col items-center gap-5 mt-10">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-4xl font-black text-primary-dark">
              {Math.round((correctCount / words.length) * 100)}
              <span className="text-xl">%</span>
            </span>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-app-black">테스트 완료!</p>
            <p className="text-sm text-app-gray mt-1">
              {words.length}개 중 <span className="font-bold text-primary-dark">{correctCount}개</span> 정답
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-hide">
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                r.correct ? 'bg-primary/10' : 'bg-red-50'
              }`}
            >
              <span className={`text-lg ${r.correct ? '' : ''}`}>
                {r.correct ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-app-black">{r.word}</p>
                <p className="text-xs text-app-gray">{r.meaning}</p>
              </div>
              {!r.correct && (
                <p className="text-xs text-red-400 line-through flex-shrink-0">{r.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button
            onClick={() => {
              setCurrent(0); setAnswer(''); setSubmitted(false);
              setCorrect(null); setResults([]); setFinished(false);
            }}
            className="w-full py-3.5 rounded-xl border-2 border-primary-dark text-sm font-bold text-primary-dark"
          >
            다시 테스트
          </button>
          <button
            onClick={() => navigate(`/voca/${bookId}`)}
            className="w-full py-3.5 rounded-xl bg-primary-dark text-sm font-bold text-white"
          >
            단어장으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col min-h-screen bg-white">
      {/* 상단 진행 바 */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="p-1 text-app-black">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-bold text-app-gray">{current + 1} / {words.length}</span>
          <div className="w-6" />
        </div>
        <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-dark rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 문제 영역 */}
      <div className="flex-1 flex flex-col px-6 py-6">
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center bg-primary/10 rounded-2xl px-8 py-6 w-full">
            <p className="text-xs text-app-gray mb-2 font-medium">다음 뜻에 해당하는 영단어를 입력하세요</p>
            <p className="text-xl font-black text-app-black leading-relaxed">{word.meaning}</p>
            {word.example && (
              <p className="text-xs text-accent mt-3 italic leading-relaxed">{word.example}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
                placeholder="영어 단어를 입력하세요"
                className={`w-full px-4 py-4 rounded-xl border-2 text-center text-lg font-bold outline-none transition-all
                  ${submitted
                    ? correct
                      ? 'border-green-400 bg-green-50 text-green-600'
                      : 'border-red-400 bg-red-50 text-red-500'
                    : 'border-primary/40 focus:border-primary-dark bg-gray-50'
                  }`}
              />
            </div>

            {submitted && (
              <div className={`text-center p-3 rounded-xl animate-fade-in ${correct ? 'bg-green-50' : 'bg-red-50'}`}>
                {correct ? (
                  <p className="text-sm font-bold text-green-600">정답입니다! 🎉</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-red-500">오답입니다</p>
                    <p className="text-sm text-app-gray mt-1">
                      정답: <span className="font-bold text-app-black">{word.word}</span>
                    </p>
                  </>
                )}
              </div>
            )}

            {!submitted ? (
              <button
                type="submit"
                disabled={!answer.trim()}
                className="w-full py-4 rounded-xl bg-primary-dark text-white font-bold text-sm disabled:opacity-40 active:opacity-80"
              >
                제출
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-primary-dark text-white font-bold text-sm active:opacity-80"
              >
                {current + 1 >= words.length ? '결과 보기' : '다음 단어 →'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
