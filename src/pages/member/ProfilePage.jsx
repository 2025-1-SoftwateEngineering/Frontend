import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const expPct = Math.round((user.exp / user.maxExp) * 100);

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 프로필 헤더 */}
      <div className="relative bg-primary px-6 pt-14 pb-20 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-dark opacity-25" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-10" />

        {/* 배경 이미지 영역 */}
        {user.profileBackground && (
          <img src={user.profileBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}

        <h1 className="relative z-10 text-lg font-black text-app-black">내 프로필</h1>
      </div>

      {/* 프로필 카드 (헤더와 겹치도록) */}
      <div className="mx-5 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-4">
            {/* 프로필 사진 */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              {/* 레벨 뱃지 */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-dark rounded-full flex items-center justify-center shadow">
                <span className="text-[9px] font-black text-white">{user.level}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-app-black text-lg leading-tight truncate">{user.nickname}</p>
              <p className="text-xs text-app-gray mt-0.5">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block mt-1.5 bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                  관리자
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 경험치 카드 */}
      <div className="mx-5 mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">레벨 {user.level}</p>
            <span className="text-xs text-app-gray">{user.exp} / {user.maxExp} XP</span>
          </div>
          <div className="w-full h-3 bg-yellow-pale rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-light rounded-full transition-all duration-700"
              style={{ width: `${expPct}%` }}
            />
          </div>
          <p className="text-xs text-app-gray mt-1.5">
            다음 레벨까지 <span className="font-semibold text-app-black">{user.maxExp - user.exp} XP</span> 남음
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-black text-primary-dark">Lv.{user.level}</p>
          <p className="text-xs text-app-gray mt-1">현재 레벨</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-black text-yellow-light">{expPct}%</p>
          <p className="text-xs text-app-gray mt-1">다음 레벨까지</p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mx-5 mt-6">
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-full py-3.5 rounded-xl bg-primary-dark text-white font-bold text-sm active:opacity-80"
        >
          프로필 편집
        </button>
      </div>
    </div>
  );
}
