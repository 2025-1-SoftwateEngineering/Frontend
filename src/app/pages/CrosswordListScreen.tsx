import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { quizApi } from '../../main/features/domain/voca/vocaApi';
import type { CrosswordListItem } from '../../main/features/domain/voca/vocaApi';

export function CrosswordListScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CrosswordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    quizApi.getCrosswordList()
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">

        {/* 헤더 */}
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-text-sub bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-text-main">십자말풀이</h1>
              <p className="text-[12px] text-text-sub">퍼즐을 선택해 도전해 보세요</p>
            </div>
          </div>
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {loading && (
            <div className="flex-1 flex items-center justify-center py-20">
              <p className="text-text-sub text-sm">로딩 중...</p>
            </div>
          )}

          {error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
              <span className="text-5xl">⚠️</span>
              <p className="text-text-sub text-sm">불러오는 중 오류가 발생했어요</p>
              <button
                onClick={() => { setError(false); setLoading(true); quizApi.getCrosswordList().then(setItems).finally(() => setLoading(false)); }}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-blue text-text-main border-none cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
              <span className="text-5xl">🧩</span>
              <p className="text-text-sub text-sm">아직 등록된 퍼즐이 없어요</p>
              <p className="text-text-sub text-xs">관리자가 문제를 등록하면 여기에 표시돼요</p>
            </div>
          )}

          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/crosswords/${item.id}`)}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 bg-white text-left"
              style={{ border: '1px solid #F0F0F0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#F0FFF4', fontSize: 24 }}
              >
                🧩
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-text-main">퍼즐 #{item.id}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[12px] text-text-sub">🪙 {item.solvedCoin.toLocaleString()} 코인</span>
                  <span className="text-[12px] text-text-sub">도전 {item.cnt}회</span>
                </div>
              </div>
              <ChevronRight size={18} color="#737373" />
            </motion.button>
          ))}
        </div>

      </div>
    </MobileLayout>
  );
}
