// ─────────────────────────────────────────────
//  FriendPage — 친구 메인 화면
//  탭: 친구 목록 / 친구 요청
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { UserPlus, Users, Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFriendStore } from '@/main/features/domain/friend';
import { FriendCard } from '@/app/components/friend/FriendCard';
import { FriendRequestCard } from '@/app/components/friend/FriendRequestCard';
import { AddFriendModal } from '@/app/components/friend/AddFriendModal';

type Tab = 'friends' | 'requests';

const FriendPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    friends,
    requests,
    loading,
    error,
    loadFriends,
    loadRequests,
    handleAccept,
    handleReject,
    handleDelete,
    handleBlock,
  } = useFriendStore();

  useEffect(() => {
    void loadFriends();
    void loadRequests();
  }, [loadFriends, loadRequests]);

  const handleViewProfile = (memberId: number) => {
    navigate(`/friend/${memberId}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8EDD6] max-w-[430px] mx-auto">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-[#1c1c1c]">친구</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B8D0FA] text-[#1c1c1c] font-semibold text-sm active:scale-95 transition-transform shadow-sm"
        >
          <UserPlus size={16} />
          <span>친구 추가</span>
        </button>
      </header>

      {/* 탭 바 */}
      <div className="flex mx-5 mb-4 bg-[#EDE9BF] rounded-2xl p-1 gap-1">
        <TabButton
          active={activeTab === 'friends'}
          onClick={() => setActiveTab('friends')}
          icon={<Users size={15} />}
          label="친구 목록"
          count={friends.length}
        />
        <TabButton
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
          icon={<Bell size={15} />}
          label="친구 요청"
          count={requests.length}
          badge
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#94B9F3]" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-sm text-[#737373]">{error}</p>
            <button
              className="mt-3 text-sm text-[#94B9F3] underline"
              onClick={() => { void loadFriends(); void loadRequests(); }}
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && activeTab === 'friends' && (
          friends.length === 0 ? (
            <EmptyState
              icon={<Users size={36} className="text-[#DDDEA5]" />}
              message="아직 친구가 없어요"
              sub="친구를 추가하고 함께 학습해보세요!"
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {friends.map((f) => (
                <FriendCard
                  key={f.memberId}
                  friend={f}
                  onViewProfile={handleViewProfile}
                  onDelete={handleDelete}
                  onBlock={handleBlock}
                />
              ))}
            </div>
          )
        )}

        {!loading && !error && activeTab === 'requests' && (
          requests.length === 0 ? (
            <EmptyState
              icon={<Bell size={36} className="text-[#DDDEA5]" />}
              message="친구 요청이 없어요"
              sub="새로운 친구를 만나보세요!"
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {requests.map((r) => (
                <FriendRequestCard
                  key={r.requestId}
                  request={r}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* 친구 추가 모달 */}
      {showAddModal && (
        <AddFriendModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// ── 탭 버튼 ────────────────────────────────────
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  badge?: boolean;
}
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, count, badge }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${
      active
        ? 'bg-white text-[#1c1c1c] shadow-sm'
        : 'text-[#737373]'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
          badge && count > 0
            ? 'bg-[#94B9F3] text-[#1c1c1c]'
            : 'bg-[#DDDEA5] text-[#1c1c1c]'
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// ── 빈 상태 ────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  sub: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, sub }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    {icon}
    <p className="font-semibold text-[#1c1c1c]">{message}</p>
    <p className="text-sm text-[#737373] text-center">{sub}</p>
  </div>
);

export default FriendPage;
