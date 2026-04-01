import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { MobileLayout } from '../components/MobileLayout';

const PRESET_BACKGROUNDS = [
  { id: 'bg1', color: '#B8D0FA', label: '하늘 블루' },
  { id: 'bg2', color: '#94B9F3', label: '딥 블루' },
  { id: 'bg3', color: '#DDDEA5', label: '올리브 그린' },
  { id: 'bg4', color: '#EDE9BF', label: '크림 옐로우' },
  { id: 'bg5', color: '#F8EDD6', label: '피치 오렌지' },
  { id: 'bg6', color: '#776A77', label: '퍼플 그레이' },
  { id: 'bg7', color: '#1c1c1c', label: '다크 블랙' },
  { id: 'bg8', color: '#4ade80', label: '민트 그린' },
];

const SHOP_ITEMS = [
  { id: 'frame1', label: '골드 프레임', locked: true, emoji: '🏅' },
  { id: 'frame2', label: '쿨 블루', locked: true, emoji: '💎' },
  { id: 'frame3', label: '네온', locked: true, emoji: '✨' },
  { id: 'frame4', label: '플라워', locked: true, emoji: '🌸' },
];

export function ProfileEditScreen() {
  const navigate = useNavigate();
  const { currentUser, updateUser, deleteAccount } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(currentUser?.nickname ?? '');
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.profileImage ?? null);
  const [selectedBg, setSelectedBg] = useState<string>(currentUser?.profileBackground ?? '#B8D0FA');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  if (!currentUser) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError('');
    if (!nickname.trim()) { setError('닉네임을 입력해 주세요.'); return; }
    setSaving(true);
    try {
      await updateUser({ nickname: nickname.trim(), profileImage, profileBackground: selectedBg });
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

  return (
    <MobileLayout>
      <div className="relative flex flex-col" style={{ height: '100dvh', background: '#f8f9ff' }}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-12 pb-4" style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <button onClick={() => navigate('/profile')} style={{ color: '#737373', background: 'none', border: 'none' }}>
            <ChevronLeft size={26} />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>프로필 편집</h1>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="rounded-2xl p-5 flex flex-col items-center gap-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <button
              onClick={() => fileRef.current?.click()}
              className="relative flex items-center justify-center rounded-full overflow-hidden active:scale-95 transition-transform"
              style={{ width: 96, height: 96, background: selectedBg, border: '3px solid #B8D0FA', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 40 }}>👤</span>
              )}
              <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
                style={{ width: 30, height: 30, background: '#B8D0FA' }}>
                <Camera size={14} color="#1c1c1c" />
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            <div className="w-full">
              <label style={{ fontSize: 13, color: '#737373', display: 'block', marginBottom: 6 }}>닉네임</label>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" style={inputStyle} />
            </div>

            <div className="w-full">
              <label style={{ fontSize: 13, color: '#737373', display: 'block', marginBottom: 6 }}>이메일 (변경 불가)</label>
              <input value={currentUser.email} disabled style={{ ...inputStyle, background: '#f0f0f0', color: '#737373' }} />
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c', marginBottom: 12 }}>🎨 프로필 배경 색상</p>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBg(bg.color)}
                  className="relative flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  style={{ border: 'none', background: 'none', padding: 0 }}
                >
                  <div className="rounded-full" style={{
                    width: 52, height: 52, background: bg.color,
                    border: selectedBg === bg.color ? '3px solid #1c1c1c' : '3px solid transparent',
                    boxShadow: selectedBg === bg.color ? '0 0 0 2px #B8D0FA' : 'none',
                    position: 'relative',
                  }}>
                    {selectedBg === bg.color && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full"
                        style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <Check size={18} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: '#737373', textAlign: 'center' }}>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1c' }}>✨ 프로필 프레임</p>
              <span className="px-2 py-0.5 rounded-full"
                style={{ fontSize: 11, background: '#DDDEA5', color: '#776A77', fontWeight: 600 }}>
                상점에서 구매
              </span>
            </div>
            <div className="flex gap-3">
              {SHOP_ITEMS.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-1.5" style={{ flex: 1, opacity: 0.5 }}>
                  <div className="rounded-full flex items-center justify-center"
                    style={{ width: 52, height: 52, background: '#f0f0f0', border: '2px dashed #ccc' }}>
                    <span style={{ fontSize: 22 }}>{item.emoji}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#737373', textAlign: 'center' }}>{item.label}</span>
                  <span style={{ fontSize: 9, color: '#ccc' }}>잠김 🔒</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 10 }}>
              상점에서 아이템을 구매하면 프레임을 적용할 수 있어요
            </p>
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
