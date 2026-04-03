import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      navigate(user ? '/home' : '/welcome', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading, user, navigate]);

  return (
    <div className="app-container flex flex-col items-center justify-center min-h-screen bg-primary">
      {/* 배경 장식 원 */}
      <div className="absolute top-[-80px] left-[-60px] w-64 h-64 rounded-full bg-primary-dark opacity-30" />
      <div className="absolute bottom-[-60px] right-[-40px] w-48 h-48 rounded-full bg-primary-dark opacity-20" />

      {/* 로고 */}
      <div className="relative z-10 flex flex-col items-center animate-fade-up">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-primary-dark/20 mb-6">
          <svg viewBox="0 0 48 48" className="w-14 h-14">
            <rect x="6" y="8" width="28" height="32" rx="4" fill="#94B9F3" />
            <rect x="14" y="8" width="28" height="32" rx="4" fill="#B8D0FA" />
            <rect x="20" y="16" width="16" height="2.5" rx="1.25" fill="#94B9F3" />
            <rect x="20" y="22" width="12" height="2.5" rx="1.25" fill="#94B9F3" />
            <rect x="20" y="28" width="8" height="2.5" rx="1.25" fill="#94B9F3" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">VocaMaster</h1>
        <p className="mt-2 text-sm text-white/70 font-medium">영단어 마스터를 위한 목표 달성 코치</p>
      </div>

      {/* 로딩 인디케이터 */}
      <div className="absolute bottom-16 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
