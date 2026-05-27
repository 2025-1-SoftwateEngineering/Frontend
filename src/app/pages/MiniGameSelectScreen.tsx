import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

const GAMES = [
  {
    emoji: '❓',
    emojiColor: '#F59E0B',
    emojiBg: '#FEF3C7',
    title: '사지선다',
    desc: '4개의 보기 중 정답을 골라보세요',
    path: '/choices',
  },
  {
    emoji: '⊞',
    emojiColor: '#8B5CF6',
    emojiBg: '#EDE9FE',
    title: '십자말풀이',
    desc: '단어의 뜻을 보고 격자에 채워보세요',
    path: '/crosswords',
  },
];

export function MiniGameSelectScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-dvh bg-surface-page">
        <div className="flex-shrink-0 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/vocabulary')}
              className="text-text-sub bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>
            <h1 className="text-[20px] font-bold text-text-main">미니게임 선택</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {GAMES.map((game) => (
            <button
              key={game.title}
              onClick={() => navigate(game.path)}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 bg-white text-left active:scale-[0.98] transition-transform"
              style={{ border: '1px solid #F0F0F0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ background: game.emojiBg, color: game.emojiColor }}
              >
                {game.emoji}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-text-main">{game.title}</p>
                <p className="text-[12px] text-text-sub mt-0.5">{game.desc}</p>
                <span className="inline-block mt-1.5 text-[12px] font-semibold" style={{ color: game.emojiColor }}>
                  도전하기 →
                </span>
              </div>
              <ChevronRight size={18} color="#737373" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
