import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import defaultProfileImg from '../assets/default_profile.svg';
import { imageApi } from '../../main/features/domain/member/imageApi';
import { ConfirmModal } from '../components/ConfirmModal';
import { MobileLayout } from '../components/MobileLayout';

export function ProfileEditScreen() {
  const navigate = useNavigate();
  const { currentUser, updateUser, updateProfile, deleteAccount } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname,          setNickname]          = useState(currentUser?.nickname ?? '');
  const [confirmPassword,   setConfirmPassword]   = useState('');
  const [saving,            setSaving]            = useState(false);
  const [error,             setError]             = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [photoUploading,    setPhotoUploading]    = useState(false);
  const [previewUrl,        setPreviewUrl]        = useState<string | null>(null);

  if (!currentUser) return null;

  const handleSave = async () => {
    setError('');
    if (!nickname.trim())      { setError('닉네임을 입력해 주세요.'); return; }
    if (!confirmPassword.trim()) { setError('현재 비밀번호를 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await updateProfile({ nickname: nickname.trim() }, confirmPassword);
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
        <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-12 pb-4 bg-white border-b border-surface-lighter">
          <button type="button" onClick={() => navigate('/profile')} className="text-text-sub bg-transparent border-0" title="뒤로 가기" aria-label="뒤로 가기">
            <ChevronLeft size={26} />
          </button>
          <h1 className="text-lg font-bold text-text-main">프로필 편집</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="rounded-2xl p-5 flex flex-col items-center gap-4 bg-white shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={photoUploading}
              className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-brand-blue-dark shadow-md bg-brand-blue cursor-pointer"
              style={{ padding: 0 }}
            >
              <img src={displayPhoto ?? defaultProfileImg} alt="프로필" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                {photoUploading ? (
                  <span className="text-white text-[11px] font-semibold">업로드 중</span>
                ) : (
                  <Camera size={22} color="#fff" />
                )}
              </div>
            </button>

            <div className="w-full">
              <label className="text-[13px] text-text-sub block mb-1.5">닉네임</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main"
              />
            </div>

            <div className="w-full">
              <label className="text-[13px] text-text-sub block mb-1.5">이메일 (변경 불가)</label>
              <input
                value={currentUser.email}
                disabled
                placeholder="이메일"
                title="이메일"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-lighter text-text-sub"
              />
            </div>

            <div className="w-full">
              <label className="text-[13px] text-text-sub block mb-1.5">현재 비밀번호 (저장 시 필요)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3.5 rounded-[14px] border border-[#e5e7eb] text-[15px] outline-none bg-surface-input text-text-main"
              />
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white shadow-sm">
            <p className="text-sm font-bold text-text-main mb-3">📊 계정 정보</p>
            <div className="flex flex-col gap-3">
              {[
                { label: '권한', value: currentUser.authorize === 'ROLE_ADMIN' ? '🛡️ 관리자' : '👤 일반 사용자' },
                { label: '연속 학습', value: `🔥 ${currentUser.streak}일` },
                { label: '보유 코인', value: `🪙 ${currentUser.coin.toLocaleString()} 코인` },
                { label: '가입일', value: new Date(currentUser.created_at).toLocaleDateString('ko-KR') },
              ].map((info) => (
                <div key={info.label} className="flex items-center justify-between py-1">
                  <span className="text-[13px] text-text-sub">{info.label}</span>
                  <span className="text-[13px] text-text-main font-semibold">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[13px] text-destructive text-center">
              {error}
            </motion.p>
          )}

          <div className="h-2" />

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-transparent border-0 text-[#ccc] text-[13px] underline text-center w-full py-2 cursor-pointer"
          >
            회원 탈퇴
          </button>

          <div className="h-5" />
        </div>

        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-surface-lighter">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full rounded-2xl py-4 active:scale-95 transition-transform text-base font-bold text-text-main border-0 ${saving ? 'bg-brand-blue-dim' : 'bg-brand-blue'}`}
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
