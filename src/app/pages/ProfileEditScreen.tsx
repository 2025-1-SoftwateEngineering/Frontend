import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { MobileLayout } from '../components/MobileLayout';

export function ProfileEditScreen() {
  const navigate = useNavigate();
  const { currentUser, updateUser, deleteAccount } = useAuth();

  const [nickname, setNickname] = useState(currentUser?.nickname ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  if (!currentUser) return null;

  const handleSave = async () => {
    setError('');
    if (!nickname.trim()) { setError('닉네임을 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await updateUser({ nickname: nickname.trim() });
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: 14,
    border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none',
    background: '#fafafa', color: '#1c1c1c', boxSizing: 'border-box',
  };

  // 이니셜 아바타
  const initial = currentUser.nickname.charAt(0).toUpperCase();

  return (
    <MobileLayout>
      <div className="relative flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-12 pb-4" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-[#737373] bg-transparent border-none"
            title="뒤로 가기"
            aria-label="뒤로 가기"
          >
            <ChevronLeft size={26} />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>프로필 편집</h1>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* 아바타 미리보기 */}
          <div className="rounded-2xl p-5 flex flex-col items-center gap-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 96, height: 96, background: '#B8D0FA', border: '3px solid #94B9F3', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
            >
              <span style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>{initial}</span>
            </div>

            <div className="w-full">
              <label style={{ fontSize: 13, color: '#737373', display: 'block', marginBottom: 6 }}>닉네임</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
                style={inputStyle}
              />
            </div>

            <div className="w-full">
              <label style={{ fontSize: 13, color: '#737373', display: 'block', marginBottom: 6 }}>이메일 (변경 불가)</label>
              <input value={currentUser.email} disabled title="사용자 이메일 (변경 불가)" className="email-input-disabled" style={inputStyle} />
            </div>
          </div>

          {/* 계정 정보 (읽기 전용) */}
          <div className="rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c', marginBottom: 12 }}>📊 계정 정보</p>
            <div className="flex flex-col gap-3">
              {[
                { label: '권한', value: currentUser.authorize === 'ROLE_ADMIN' ? '🛡️ 관리자' : '👤 일반 사용자' },
                { label: '연속 학습', value: `🔥 ${currentUser.streak}일` },
                { label: '보유 코인', value: `🪙 ${currentUser.coin.toLocaleString()} 코인` },
                { label: '가입일', value: new Date(currentUser.created_at).toLocaleDateString('ko-KR') },
              ].map((info) => (
                <div key={info.label} className="flex items-center justify-between py-1">
                  <span style={{ fontSize: 13, color: '#737373' }}>{info.label}</span>
                  <span style={{ fontSize: 13, color: '#1c1c1c', fontWeight: 600 }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 13, color: '#d4183d', textAlign: 'center' }}>
              {error}
            </motion.p>
          )}

          <div style={{ height: 8 }} />

          <button
            onClick={() => setShowWithdrawModal(true)}
            style={{ background: 'none', border: 'none', color: '#ccc', fontSize: 13, textDecoration: 'underline', textAlign: 'center', width: '100%', padding: '8px 0', cursor: 'pointer' }}
          >
            회원 탈퇴
          </button>

          <div style={{ height: 20 }} />
        </div>

        {/* Save button */}
        <div className="flex-shrink-0 px-5 py-4" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl py-4 active:scale-95 transition-transform"
            style={{ background: saving ? '#c8ddf8' : '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700, border: 'none' }}
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
