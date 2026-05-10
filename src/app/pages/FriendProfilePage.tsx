import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, ShieldBan, ShieldOff, UserMinus, UserPlus,
  BookOpen, Flame, Trophy, Loader2, ShieldAlert } from 'lucide-react';
import type { FriendProfile } from '@/main/features/domain/friend';
import { sendFriendRequest, deleteFriend, blockUser, unblockUser } from '@/main/features/domain/friend'; //테스트용
//import { getFriendProfile, sendFriendRequest, deleteFriend, blockUser, unblockUser } from '@/main/features/domain/friend';
import { FriendAvatar } from '@/app/components/friend/FriendAvatar';

const FriendProfilePage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  //테스트용 데이터
  useEffect(() => {
  const id = Number(memberId);
  if (!id) return;

  setLoading(true);
  setTimeout(() => {
    setProfile({
      memberId: id,
      username: 'friend@test.com',
      nickname: '친구',
      level: 5,
      experience: 72,
      totalWordsLearned: 240,
      streakDays: 12,
      isBlocked: false,
      status: 'FRIEND',
    });
    setLoading(false);
  }, 300);
}, [memberId]);
  /*
  useEffect(() => {
    const id = Number(memberId);
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getFriendProfile(id);
        if (res.isSuccess) { setProfile(res.result); setIsBlocked(res.result.isBlocked); }
      } finally { setLoading(false); }
    })();
  }, [memberId]);
*/
  const id = Number(memberId);

  const handleSendRequest = async () => {
    setActionLoading(true);
    try { await sendFriendRequest(id); setProfile((p) => p ? { ...p, status: 'PENDING_SENT' } : p); }
    finally { setActionLoading(false); }
  };
  const handleDeleteFriend = async () => {
    setActionLoading(true);
    try { await deleteFriend(id); navigate(-1); }
    finally { setActionLoading(false); }
  };
  const handleBlock = async () => {
    setActionLoading(true);
    try { await blockUser(id); navigate(-1); }
    finally { setActionLoading(false); }
  };
  const handleUnblock = async () => {
    setActionLoading(true);
    try { await unblockUser(id); setIsBlocked(false); setProfile((p) => p ? { ...p, isBlocked: false } : p); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[430px] mx-auto" style={{ background: '#f8f9ff' }}>
      <header className="flex items-center gap-2 px-4 pt-12 pb-4"
        style={{ background: 'linear-gradient(135deg, #B8D0FA 0%, #94B9F3 100%)' }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.25)' }}>
          <ChevronLeft size={20} color="#fff" />
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>프로필</h1>
      </header>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin" style={{ color: '#94B9F3' }} />
        </div>
      )}

      {!loading && profile?.isBlocked && (
        <BlockedProfileView onUnblock={handleUnblock} loading={actionLoading} />
      )}

      {!loading && profile && !profile.isBlocked && (
        <div className="flex-1 flex flex-col pb-8">
          <div className="mx-4 mt-4 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-3"
            style={{ border: '1px solid #f0f0f0' }}>
            <FriendAvatar nickname={profile.nickname} profileImageUrl={profile.profileImageUrl}
              size="lg" level={profile.level} />
            <div className="text-center">
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1c1c1c' }}>{profile.nickname}</h2>
              <p style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>{profile.username}</p>
            </div>
            <div className="w-full mt-1">
              <div className="flex justify-between mb-1" style={{ fontSize: 11, color: '#737373' }}>
                <span>Lv.{profile.level}</span>
                <span>{profile.experience % 100} / 100 XP</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${profile.experience % 100}%`, background: 'linear-gradient(90deg, #B8D0FA, #94B9F3)' }} />
              </div>
            </div>
          </div>

          <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
            <StatCard icon={<BookOpen size={18} color="#94B9F3" />} value={profile.totalWordsLearned} label="학습한 단어" />
            <StatCard icon={<Flame size={18} color="#fb923c" />} value={profile.streakDays} label="연속 학습일" />
            <StatCard icon={<Trophy size={18} color="#94B9F3" />} value={`Lv.${profile.level}`} label="현재 레벨" />
          </div>

          <div className="mx-4 mt-4 flex flex-col gap-2">
            {profile.status === 'FRIEND' && (
              <button onClick={handleDeleteFriend} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform"
                style={{ background: '#f0f0f0', color: '#737373' }}>
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                친구 삭제
              </button>
            )}
            {profile.status === 'NONE' && (
              <button onClick={handleSendRequest} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #B8D0FA 0%, #94B9F3 100%)', color: '#fff' }}>
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                친구 요청 보내기
              </button>
            )}
            {profile.status === 'PENDING_SENT' && (
              <div className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: '#f0f0f0', color: '#737373' }}>
                <UserPlus size={16} />요청 전송됨
              </div>
            )}
            {!isBlocked && (
              <button onClick={handleBlock} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform"
                style={{ border: '1px solid #fca5a5', color: '#f87171', background: '#fff' }}>
                <ShieldBan size={16} />차단하기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps { icon: React.ReactNode; value: number | string; label: string; }
const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm"
    style={{ border: '1px solid #f0f0f0' }}>
    {icon}
    <span style={{ fontWeight: 700, color: '#1c1c1c', fontSize: 14 }}>{value}</span>
    <span style={{ fontSize: 10, color: '#737373', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
  </div>
);

interface BlockedProfileViewProps { onUnblock: () => void; loading: boolean; }
const BlockedProfileView: React.FC<BlockedProfileViewProps> = ({ onUnblock, loading }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#e8f0fe' }}>
      <ShieldAlert size={36} color="#94B9F3" />
    </div>
    <div className="text-center">
      <p style={{ fontWeight: 700, color: '#1c1c1c', fontSize: 15 }}>프로필을 확인할 수 없어요</p>
      <p style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>차단된 사용자의 프로필은 표시되지 않아요.</p>
    </div>
    <button onClick={onUnblock} disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
      style={{ background: '#f0f0f0', color: '#737373' }}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
      차단 해제
    </button>
  </div>
);

export default FriendProfilePage;