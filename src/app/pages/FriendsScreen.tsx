import React, { useEffect, useState } from 'react';
import { UserPlus, Users, Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFriendStore } from '@/main/features/domain/friend';
import { FriendCard } from '@/app/components/friend/FriendCard';
import { FriendRequestCard } from '@/app/components/friend/FriendRequestCard';
import { AddFriendModal } from '@/app/components/friend/AddFriendModal';

type Tab = 'friends' | 'requests';

export function FriendsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [showAddModal, setShowAddModal] = useState(false);

  const { friends, requests, loading, error, loadFriends, loadRequests,
    handleAccept, handleReject, handleDelete, handleBlock } = useFriendStore();

  useEffect(() => {
    void loadFriends();
    void loadRequests();
  }, [loadFriends, loadRequests]);

  return (
    <div className="flex flex-col h-full bg-surface-page">
      <div className="px-5 pt-14 pb-5 gradient-brand">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-white">친구</h1>
            <p className="text-[13px] text-white/80 mt-0.5">친구와 함께 학습하면 더 재미있어요</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold active:scale-95 transition-transform text-[13px] text-white border border-white/40 bg-white/25"
          >
            <UserPlus size={15} />
            친구 추가
          </button>
        </div>
      </div>

      <div className="flex mx-4 mt-4 mb-3 p-1 gap-1 rounded-2xl bg-surface-lighter">
        <TabButton active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}
          icon={<Users size={14} />} label="친구 목록" count={friends.length} />
        <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')}
          icon={<Bell size={14} />} label="친구 요청" count={requests.length} badge />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-brand-blue-dark" />
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-[13px] text-text-sub">{error}</p>
            <button className="text-[13px] text-brand-blue-dark mt-3 underline"
              onClick={() => { void loadFriends(); void loadRequests(); }}>다시 시도</button>
          </div>
        )}
        {!loading && !error && activeTab === 'friends' && (
          friends.length === 0
            ? <EmptyState emoji="👫" message="아직 친구가 없어요" sub="친구를 추가하고 함께 학습해보세요!" />
            : <div className="flex flex-col gap-2.5">
                {friends.map((f) => (
                  <FriendCard key={f.memberId} friend={f}
                    onViewProfile={(id) => navigate(`/friends/${id}`)}
                    onDelete={handleDelete} onBlock={handleBlock} />
                ))}
              </div>
        )}
        {!loading && !error && activeTab === 'requests' && (
          requests.length === 0
            ? <EmptyState emoji="🔔" message="친구 요청이 없어요" sub="새로운 친구를 만나보세요!" />
            : <div className="flex flex-col gap-2.5">
                {requests.map((r) => (
                  <FriendRequestCard key={r.requestId} request={r}
                    onAccept={handleAccept} onReject={handleReject} />
                ))}
              </div>
        )}
      </div>

      {showAddModal && <AddFriendModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

interface TabButtonProps {
  active: boolean; onClick: () => void; icon: React.ReactNode;
  label: string; count: number; badge?: boolean;
}
function TabButton({ active, onClick, icon, label, count, badge }: TabButtonProps) {
  return (
    <button onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all text-[13px] border-0 ${active ? 'bg-white text-text-main font-semibold shadow-sm' : 'bg-transparent text-text-sub font-normal'}`}>
      {icon}<span>{label}</span>
      {count > 0 && (
        <span className={`rounded-full leading-none text-[10px] font-bold px-1.5 py-0.5 text-white ${badge ? 'bg-brand-blue-dark' : 'bg-brand-blue'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({ emoji, message, sub }: { emoji: string; message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#e8f0fe] text-4xl">{emoji}</div>
      <p className="font-bold text-text-main text-base">{message}</p>
      <p className="text-[13px] text-text-sub text-center">{sub}</p>
    </div>
  );
}
