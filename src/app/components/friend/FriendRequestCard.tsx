// ─────────────────────────────────────────────
//  FriendRequestCard — 친구 요청 아이템 카드
// ─────────────────────────────────────────────

import React from 'react';
import { Check, X } from 'lucide-react';
import type { FriendRequestItem } from '@/main/features/domain/friend';
import { FriendAvatar } from './FriendAvatar';

interface FriendRequestCardProps {
  request: FriendRequestItem;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
}) => {
  const { sender } = request;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm border border-[#B8D0FA]/40">
      <FriendAvatar
        nickname={sender.nickname}
        profileImageUrl={sender.profileImageUrl}
        size="md"
        level={sender.level}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1c1c1c] text-sm truncate">{sender.nickname}</p>
        <p className="text-[#737373] text-xs">@{sender.username}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 수락 */}
        <button
          onClick={() => onAccept(request.requestId)}
          className="w-8 h-8 rounded-full bg-[#B8D0FA] text-[#1c1c1c] flex items-center justify-center hover:bg-[#94B9F3] transition-colors active:scale-90"
          aria-label="친구 요청 수락"
        >
          <Check size={16} strokeWidth={2.5} />
        </button>
        {/* 거절 */}
        <button
          onClick={() => onReject(request.requestId)}
          className="w-8 h-8 rounded-full bg-[#F8EDD6] text-[#737373] flex items-center justify-center hover:bg-[#EDE9BF] transition-colors active:scale-90"
          aria-label="친구 요청 거절"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
