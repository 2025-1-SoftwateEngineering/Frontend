import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-container relative flex flex-col items-center justify-between min-h-screen bg-white overflow-hidden px-6 py-16">
      {/* 배경 그래픽 */}
      <svg className="absolute top-0 right-0 opacity-20" width="280" height="280" viewBox="0 0 280 280" fill="none">
        <circle cx="210" cy="70" r="130" fill="#B8D0FA" />
        <circle cx="250" cy="120" r="80" fill="#94B9F3" />
      </svg>
      <svg className="absolute bottom-0 left-0 opacity-15" width="220" height="220" viewBox="0 0 220 220" fill="none">
        <circle cx="30" cy="190" r="120" fill="#DDDEA5" />
        <circle cx="60" cy="160" r="70" fill="#EDE9BF" />
      </svg>

      {/* 상단 텍스트 */}
      <div className="relative z-10 flex flex-col items-center mt-12">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-dark/20 mb-8">
          <svg viewBox="0 0 48 48" className="w-12 h-12">
            <rect x="6" y="8" width="28" height="32" rx="4" fill="#94B9F3" />
            <rect x="14" y="8" width="28" height="32" rx="4" fill="#FFFFFF" opacity="0.9" />
            <rect x="20" y="16" width="16" height="2.5" rx="1.25" fill="#94B9F3" />
            <rect x="20" y="22" width="12" height="2.5" rx="1.25" fill="#94B9F3" />
            <rect x="20" y="28" width="8" height="2.5" rx="1.25" fill="#94B9F3" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-primary-dark mb-3 tracking-widest uppercase">VocaMaster</p>
        <h1 className="text-2xl font-black text-app-black text-center leading-tight">
          영단어 마스터를 위한<br />
          <span className="text-primary-dark">목표 달성 코치</span>
        </h1>
        <p className="mt-4 text-sm text-app-gray text-center leading-relaxed">
          TOEIC 고득점을 향한 첫 걸음,<br />오늘부터 시작하세요.
        </p>
      </div>

      {/* 중앙 일러스트 */}
      <div className="relative z-10 flex justify-center my-8">
        <div className="relative">
          <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* 책 스택 일러스트 */}
              <rect x="20" y="90" width="120" height="20" rx="6" fill="#DDDEA5" />
              <rect x="28" y="72" width="104" height="22" rx="6" fill="#EDE9BF" />
              <rect x="36" y="54" width="88" height="22" rx="6" fill="#B8D0FA" />
              <rect x="44" y="36" width="72" height="22" rx="6" fill="#94B9F3" />
              {/* 별 */}
              <text x="108" y="28" fontSize="18" fill="#DDDEA5">✦</text>
              <text x="30" y="50" fontSize="12" fill="#EDE9BF">✦</text>
              {/* 선 (텍스트 라인) */}
              <rect x="54" y="44" width="40" height="3" rx="1.5" fill="white" opacity="0.7" />
              <rect x="54" y="50" width="28" height="3" rx="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          {/* 플로팅 뱃지 */}
          <div className="absolute -top-2 -right-2 bg-yellow-pale rounded-xl px-3 py-1.5 shadow-md">
            <span className="text-xs font-bold text-app-black">TOEIC 950+</span>
          </div>
          <div className="absolute -bottom-2 -left-2 bg-white rounded-xl px-3 py-1.5 shadow-md border border-primary/20">
            <span className="text-xs font-bold text-primary-dark">단어 100개 달성!</span>
          </div>
        </div>
      </div>

      {/* 시작하기 버튼 */}
      <div className="relative z-10 w-full">
        <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
          시작하기
        </Button>
      </div>
    </div>
  );
}
