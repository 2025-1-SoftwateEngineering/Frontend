// ─────────────────────────────────────────────
//  FriendAvatar — 프로필 이미지 또는 이니셜 표시
// ─────────────────────────────────────────────

import React from 'react';

interface FriendAvatarProps {
  nickname: string;
  profileImageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  level?: number;
}

const sizeMap = {
  sm: { outer: 'w-10 h-10', text: 'text-sm', badge: 'text-[9px] px-1 py-0' },
  md: { outer: 'w-12 h-12', text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5' },
  lg: { outer: 'w-16 h-16', text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
};

const levelColors = [
  'bg-[#DDDEA5] text-[#1c1c1c]',
  'bg-[#94B9F3] text-[#1c1c1c]',
  'bg-[#B8D0FA] text-[#1c1c1c]',
  'bg-[#776A77] text-white',
];

export const FriendAvatar: React.FC<FriendAvatarProps> = ({
  nickname,
  profileImageUrl,
  size = 'md',
  level,
}) => {
  const sz = sizeMap[size];
  const initial = (nickname?.[0] ?? '?').toUpperCase();
  const levelColor = level !== undefined ? levelColors[Math.floor((level - 1) / 10) % levelColors.length] : levelColors[0];

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sz.outer} rounded-full overflow-hidden flex items-center justify-center bg-[#EDE9BF] border-2 border-[#B8D0FA]`}
      >
        {profileImageUrl ? (
          <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
        ) : (
          <span className={`font-bold text-[#776A77] ${sz.text}`}>{initial}</span>
        )}
      </div>
      {level !== undefined && (
        <span
          className={`absolute -bottom-1 -right-1 rounded-full font-bold leading-none ${levelColor} ${sz.badge}`}
        >
          Lv.{level}
        </span>
      )}
    </div>
  );
};
