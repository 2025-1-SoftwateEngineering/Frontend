import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import BackHeader from '../../components/common/BackHeader';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, updateUser, withdraw } = useAuth();
  const fileRef = useRef(null);

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [profilePreview, setProfilePreview] = useState(user?.profileImage || null);
  const [profileFile, setProfileFile] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 구매한 꾸미기 아이템 (현재는 미구현 - 상점 연동 후)
  const dummyFrames = [null, null, null];
  const dummyBgs = [null, null, null];

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!nickname.trim()) { setError('닉네임을 입력하세요.'); return; }
    setError('');
    setLoading(true);
    // 백엔드 연동 시 memberService.updateProfile() 호출
    await new Promise((r) => setTimeout(r, 500));
    updateUser({
      nickname: nickname.trim(),
      profileImage: profilePreview,
    });
    setLoading(false);
    navigate('/profile');
  };

  const handleWithdraw = () => {
    withdraw();
    navigate('/welcome', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <BackHeader title="프로필 편집" />

      <div className="flex flex-col gap-5 px-5 py-5 pb-10">
        {/* 프로필 사진 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-app-black mb-4">프로필 사진</p>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
              {profilePreview ? (
                <img src={profilePreview} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current.click()}
                className="px-4 py-2 rounded-xl bg-primary/15 text-sm font-semibold text-primary-dark active:opacity-70"
              >
                사진 변경
              </button>
              {profilePreview && (
                <button
                  onClick={() => { setProfilePreview(null); setProfileFile(null); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-app-gray active:opacity-70"
                >
                  사진 제거
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImage} />
        </div>

        {/* 닉네임 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-app-black mb-3">닉네임</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 ${
              error ? 'border-red-400' : 'border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30'
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>

        {/* 프로필 프레임 선택 (상점 연동 후) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">프로필 프레임</p>
            <span className="text-xs text-app-gray">상점에서 구매 가능</span>
          </div>
          <div className="flex gap-3">
            {dummyFrames.map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center"
              >
                <span className="text-xs text-app-gray">준비중</span>
              </div>
            ))}
          </div>
        </div>

        {/* 프로필 배경 선택 (상점 연동 후) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">프로필 배경</p>
            <span className="text-xs text-app-gray">상점에서 구매 가능</span>
          </div>
          <div className="flex gap-3">
            {dummyBgs.map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center"
              >
                <span className="text-xs text-app-gray">준비중</span>
              </div>
            ))}
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-primary-dark text-white font-bold text-sm active:opacity-80 disabled:opacity-50"
        >
          {loading ? '저장 중...' : '변경사항 저장'}
        </button>

        {/* 회원 탈퇴 */}
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="mt-4 text-center text-xs text-app-gray/50 underline"
        >
          회원 탈퇴
        </button>
      </div>

      {showWithdrawModal && (
        <Modal
          title="회원 탈퇴"
          message="정말 탈퇴하시겠습니까? 모든 학습 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다."
          confirmText="탈퇴하기"
          cancelText="취소"
          confirmDanger
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}
