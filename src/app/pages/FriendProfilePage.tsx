import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, ShieldBan, ShieldOff, UserMinus, UserPlus,
  BookOpen, Flame, Coins, Loader2, ShieldAlert } from 'lucide-react';
import type { FriendProfile } from '@/main/features/domain/friend';
import { sendFriendRequest, deleteFriend, blockUser, unblockUser } from '@/main/features/domain/friend';
import { memberApi } from '@/main/features/domain/member/memberApi';
import { FriendAvatar } from '@/app/components/friend/FriendAvatar';

const FriendProfilePage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const id = Number(memberId);
    if (!id) return;

    setLoading(true);
    memberApi.getFriendProfile(id)
      .then((res) => {
        setProfile({
          memberId: res.id,
          username: '',
          nickname: res.nickname,
          profileImageUrl: undefined,
          totalWordsLearned: res.totalWordsLearned ?? 0,
          streakDays: res.streak,
          coin: res.coin,
          isBlocked: false,
          status: 'FRIEND',
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [memberId]);

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
    <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-surface-page">
      <header className="flex items-center gap-2 px-4 pt-12 pb-4 gradient-brand">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/25 border-0">
          <ChevronLeft size={20} color="#fff" />
        </button>
        <h1 className="text-base font-semibold text-white">프로필</h1>
      </header>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-blue-dark" />
        </div>
      )}

      {!loading && profile?.isBlocked && (
        <BlockedProfileView onUnblock={handleUnblock} loading={actionLoading} />
      )}

      {!loading && profile && !profile.isBlocked && (
        <div className="flex-1 flex flex-col pb-8">
          <div className="mx-4 mt-4 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-3 border border-surface-lighter">
            <FriendAvatar nickname={profile.nickname} profileImageUrl={profile.profileImageUrl}
              size="lg" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-text-main">{profile.nickname}</h2>
              <p className="text-[13px] text-text-sub mt-0.5">{profile.username}</p>
            </div>
            <div className="w-full mt-1">
              <div className="flex justify-between mb-1 text-[11px] text-text-sub">
                <span>이번 주 연속 학습</span>
                <span>{profile.streakDays} / 7일</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-surface-lighter">
                <div
                  className="h-full rounded-full transition-all gradient-brand"
                  style={{ width: `${Math.min((profile.streakDays / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
            <StatCard icon={<BookOpen size={18} color="#94B9F3" />} value={profile.totalWordsLearned} label="학습한 단어" />
            <StatCard icon={<Flame size={18} color="#fb923c" />} value={profile.streakDays} label="연속 학습일" />
            <StatCard icon={<Coins size={18} color="#DDDEA5" />} value={profile.coin.toLocaleString()} label="보유 코인" />
          </div>

          <div className="mx-4 mt-4 flex flex-col gap-2">
            {profile.status === 'FRIEND' && (
              <button onClick={handleDeleteFriend} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform bg-surface-lighter text-text-sub border-0">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                친구 삭제
              </button>
            )}
            {profile.status === 'NONE' && (
              <button onClick={handleSendRequest} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform gradient-brand text-white border-0">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                친구 요청 보내기
              </button>
            )}
            {profile.status === 'PENDING_SENT' && (
              <div className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm bg-surface-lighter text-text-sub">
                <UserPlus size={16} />요청 전송됨
              </div>
            )}
            {!isBlocked && (
              <button onClick={handleBlock} disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60 active:scale-[0.98] transition-transform border border-[#fca5a5] text-[#f87171] bg-white">
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
  <div className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm border border-surface-lighter">
    {icon}
    <span className="font-bold text-text-main text-sm">{value}</span>
    <span className="text-[10px] text-text-sub text-center leading-[1.3]">{label}</span>
  </div>
);

interface BlockedProfileViewProps { onUnblock: () => void; loading: boolean; }
const BlockedProfileView: React.FC<BlockedProfileViewProps> = ({ onUnblock, loading }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#e8f0fe]">
      <ShieldAlert size={36} color="#94B9F3" />
    </div>
    <div className="text-center">
      <p className="font-bold text-text-main text-[15px]">프로필을 확인할 수 없어요</p>
      <p className="text-[13px] text-text-sub mt-1">차단된 사용자의 프로필은 표시되지 않아요.</p>
    </div>
    <button onClick={onUnblock} disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm active:scale-95 transition-transform bg-surface-lighter text-text-sub border-0">
      {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
      차단 해제
    </button>
  </div>
);

export default FriendProfilePage;
