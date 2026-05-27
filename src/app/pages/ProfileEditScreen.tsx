import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import defaultProfileImg from '../assets/default_profile.svg';
import { imageApi } from '../../main/features/domain/member/imageApi';
import { ConfirmModal } from '../components/ConfirmModal';
import { MobileLayout } from '../components/MobileLayout';

// ─── 프로필 프레임 옵션 (추후 상점 연동 예정) ────────────────────────────────
const FRAMES = [
  { key: 'gold',   label: '골드 크라운', emoji: '🏅' },
  { key: 'blue',   label: '골 블루',    emoji: '💎' },
  { key: 'neon',   label: '네온',       emoji: '⚡' },
  { key: 'flower', label: '플라워',     emoji: '🌸' },
];

export function ProfileEditScreen() {
  const navigate = useNavigate();
  const { currentUser, updateUser, updateProfile, deleteAccount } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname,          setNickname]          = useState(currentUser?.nickname ?? '');
  const [saving,            setSaving]            = useState(false);
  const [error,             setError]             = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [photoUploading,    setPhotoUploading]    = useState(false);
  const [previewUrl,        setPreviewUrl]        = useState<string | null>(null);

  if (!currentUser) return null;

  // ─── 핸들러 ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setError('');
    if (!nickname.trim()) { setError('닉네임을 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await updateProfile({ nickname: nickname.trim() }, '');
      navigate('/profile');
    } catch (e: any) {
      setError(e.message || '저장에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      await deleteAccount();
      navigate('/welcome', { replace: true });
    } catch (e: any) {
      setError(e.message || '탈퇴 처리에 실패했습니다.');
    }
  };

  const handlePhotoClick = () => {
    if (!photoUploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setPhotoUploading(true);
    setError('');
    try {
      const { url, fileName } = await imageApi.createSignedUri(file.name);
      await imageApi.uploadToGcs(url, file);
      const { publicUrl } = await imageApi.confirmUpload(fileName);
      await updateUser({ profileUrl: publicUrl });
    } catch {
      setError('사진 업로드에 실패했어요. 다시 시도해 주세요.');
      setPreviewUrl(null);
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const displayPhoto = previewUrl ?? (currentUser.profileUrl || null);

  return (
    <MobileLayout>
      <div className="relative flex flex-col h-dvh bg-surface-page">

        {/* 헤더 */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-4 pb-4 bg-white border-b border-surface-lighter">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-text-sub bg-transparent border-0 cursor-pointer"
            aria-label="뒤로 가기"
          >
            <ChevronLeft size={26} />
          </button>
          <h1 className="text-lg font-bold text-text-main">프로필 편집</h1>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">

          {/* 프로필 사진 */}
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="relative">
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={photoUploading}
                className="w-20 h-20 rounded-full overflow-hidden bg-surface-lighter cursor-pointer"
                style={{ padding: 0, border: '2px solid #e5e7eb' }}
              >
                <img
                  src={displayPhoto ?? defaultProfileImg}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={photoUploading}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-white cursor-pointer"
                style={{ padding: 0, border: '1.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
              >
                {photoUploading
                  ? <span className="text-[7px] text-text-sub">...</span>
                  : <Camera size={12} color="#555" />
                }
              </button>
            </div>
          </div>

          {/* 닉네임 / 이메일 */}
          <div
            className="rounded-2xl px-4 py-4 bg-white flex flex-col gap-3"
            style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <div>
              <label className="text-[13px] text-text-sub block mb-1.5">닉네임</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
                className="w-full px-4 py-3 rounded-[12px] text-[14px] outline-none text-text-main"
                style={{ background: '#f8f9ff', border: '1.5px solid #e5e7eb' }}
              />
            </div>
            <div>
              <label className="text-[13px] text-text-sub block mb-1.5">이메일 (변경 불가)</label>
              <input
                value={currentUser.email}
                disabled
                placeholder="이메일"
                title="이메일"
                className="w-full px-4 py-3 rounded-[12px] text-[14px] outline-none text-text-sub"
                style={{ background: '#f0f0f0', border: '1.5px solid #e5e7eb' }}
              />
            </div>
          </div>

          {/* 프로필 프레임 */}
          <div
            className="rounded-2xl px-4 py-4 bg-white"
            style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-text-main">🖼️ 프로필 프레임</p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer"
                style={{ background: '#FEF9C3', color: '#A16207', border: 'none' }}
              >
                상점에서 구매
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {FRAMES.map((f) => (
                <div key={f.key} className="flex flex-col items-center gap-1.5 opacity-40">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: '#f3f3f5', fontSize: 24 }}
                  >
                    {f.emoji}
                  </div>
                  <span className="text-[10px] text-text-sub text-center leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-text-sub mt-3 text-center leading-relaxed">
              상점에서 아이템을 구매하면 프레임을 적용할 수 있어요
            </p>
          </div>

          {/* 에러 */}
          {error && (
            <p className="text-[13px] text-center" style={{ color: '#f87171' }}>{error}</p>
          )}

          {/* 회원 탈퇴 */}
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="bg-transparent border-0 text-[13px] underline text-center w-full py-2 cursor-pointer"
            style={{ color: '#ccc' }}
          >
            회원 탈퇴
          </button>

          <div className="h-2" />
        </div>

        {/* 하단 저장 버튼 */}
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full rounded-2xl py-4 active:scale-95 transition-transform text-base font-bold text-text-main border-0 cursor-pointer ${saving ? 'bg-brand-blue-dim' : 'bg-brand-blue'}`}
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>

        <ConfirmModal
          isOpen={showWithdrawModal}
          title="정말 탈퇴하시겠습니까?"
          message="탈퇴하면 모든 학습 데이터가 삭제되며 복구할 수 없습니다."
          confirmLabel="탈퇴하기"
          cancelLabel="취소"
          confirmColor="#d4183d"
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
        />
      </div>
    </MobileLayout>
  );
}
