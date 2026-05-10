// ─────────────────────────────────────────────
//  FriendCard — 친구 목록 아이템 카드
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { UserX, MoreVertical, Trash2, ShieldBan } from 'lucide-react';
import type { FriendItem } from '@/main/features/domain/friend';
import { FriendAvatar } from './FriendAvatar';

interface FriendCardProps {
  friend: FriendItem;
  onViewProfile: (memberId: number) => void;
  onDelete: (memberId: number) => void;
  onBlock: (memberId: number) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onViewProfile,
  onDelete,
  onBlock,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm border border-[#F8EDD6] active:scale-[0.98] transition-transform">
      {/* 프로필 클릭 → 프로필 화면 */}
      <button
        className="flex items-center gap-3 flex-1 text-left"
        onClick={() => onViewProfile(friend.memberId)}
      >
        <FriendAvatar
          nickname={friend.nickname}
          profileImageUrl={friend.profileImageUrl}
          size="md"
          level={friend.level}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1c1c1c] text-sm truncate">{friend.nickname}</p>
          <p className="text-[#737373] text-xs truncate">@{friend.username}</p>
        </div>
      </button>

      {/* 더보기 메뉴 */}
      <div className="relative">
        <button
          className="p-1.5 rounded-full text-[#737373] hover:bg-[#F8EDD6] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <>
            {/* 배경 클릭 닫기 */}
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-[#EDE9BF] overflow-hidden min-w-[130px]">
              <button
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#1c1c1c] hover:bg-[#F8EDD6] transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(friend.memberId);
                }}
              >
                <Trash2 size={14} className="text-[#737373]" />
                친구 삭제
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  onBlock(friend.memberId);
                }}
              >
                <ShieldBan size={14} />
                차단하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
