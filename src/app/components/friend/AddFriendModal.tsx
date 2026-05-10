// ─────────────────────────────────────────────
//  AddFriendModal — 친구 추가 팝업창
//  ID(username) 검색 → 친구 요청 전송
// ─────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { Search, X, UserPlus, ShieldAlert, UserCheck, Loader2 } from 'lucide-react';
import type { UserSearchResult } from '@/main/features/domain/friend';
import { searchUserByUsername, sendFriendRequest } from '@/main/features/domain/friend';
import { FriendAvatar } from './FriendAvatar';

interface AddFriendModalProps {
  onClose: () => void;
}

type SearchState = 'idle' | 'loading' | 'found' | 'not_found' | 'blocked' | 'error';

export const AddFriendModal: React.FC<AddFriendModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [result, setResult] = useState<UserSearchResult | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  //테스트용
  const handleSearch = async () => {
  const trimmed = query.trim();
  if (!trimmed) return;
  setSearchState('loading');
  setResult(null);
  setSent(false);

  setTimeout(() => {
    const MOCK_USERS = [
      { id: 10, memberId: 10, nickname: '테스트유저1', email: 'test1@test.com', username: 'test1', level: 3, status: 'NONE' as const, isBlocked: false },
      { id: 11, memberId: 11, nickname: '테스트유저2', email: 'test2@test.com', username: 'test2', level: 7, status: 'FRIEND' as const, isBlocked: false },
      { id: 12, memberId: 12, nickname: '차단유저', email: 'blocked@test.com', username: 'blocked', level: 2, status: 'NONE' as const, isBlocked: true },
    ];

    const found = MOCK_USERS.find((u) => u.email === trimmed);
    if (!found) {
      setSearchState('not_found');
    } else if (found.isBlocked) {
      setSearchState('blocked');
    } else {
      setResult(found);
      setSearchState('found');
    }
  }, 500);
};
  /*
  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchState('loading');
    setResult(null);
    setSent(false);

    try {
      const res = await searchUserByUsername(trimmed);
      if (res.isSuccess && res.result) {
        if (res.result.isBlocked) {
          setSearchState('blocked');
        } else {
          setResult(res.result);
          setSearchState('found');
        }
      } else {
        setSearchState('not_found');
      }
    } catch {
      setSearchState('not_found');
    }
  };
*/
  const handleSendRequest = async () => {
    if (!result) return;
    setSending(true);
    try {
      await sendFriendRequest(result.memberId);
      setSent(true);
    } catch {
      // 이미 요청 중인 경우 등
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const statusLabel: Record<string, string> = {
    FRIEND: '이미 친구',
    PENDING_SENT: '요청 전송됨',
    PENDING_RECEIVED: '요청 받음',
    BLOCKED: '차단됨',
    NONE: '',
  };

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* 바텀 시트 */}
    <div className="w-full max-w-[430px] rounded-t-3xl px-5 pt-5 pb-10 animate-slide-up" style={{ background: '#f8f9ff' }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1c1c1c]">친구 추가</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EDE9BF] flex items-center justify-center text-[#737373]"
          >
            <X size={18} />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-[#B8D0FA]/60">
            <Search size={16} className="text-[#737373] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="이메일로 검색"
              className="flex-1 text-sm bg-transparent outline-none text-[#1c1c1c] placeholder:text-[#737373]"
              autoFocus
            />
            {query && (
              <button onClick={() => { setQuery(''); setResult(null); setSearchState('idle'); }}>
                <X size={14} className="text-[#737373]" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || searchState === 'loading'}
            className="px-4 py-2.5 rounded-xl bg-[#B8D0FA] text-[#1c1c1c] font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
          >
            검색
          </button>
        </div>

        {/* 검색 결과 영역 */}
        <div className="mt-4 min-h-[100px]">
          {searchState === 'loading' && (
            <div className="flex justify-center items-center py-8">
              <Loader2 size={24} className="animate-spin text-[#94B9F3]" />
            </div>
          )}

          {searchState === 'not_found' && (
            <div className="flex flex-col items-center py-8 gap-2">
              <Search size={28} className="text-[#DDDEA5]" />
              <p className="text-sm text-[#737373]">해당 아이디를 찾을 수 없어요.</p>
            </div>
          )}

          {searchState === 'blocked' && (
            <div className="flex flex-col items-center py-8 gap-2">
              <ShieldAlert size={28} className="text-[#776A77]" />
              <p className="text-sm text-[#737373]">프로필을 확인할 수 없어요.</p>
              <p className="text-xs text-[#737373]">(상대방이 차단한 계정이에요)</p>
            </div>
          )}

          {searchState === 'found' && result && (
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#EDE9BF]">
              <FriendAvatar
                nickname={result.nickname}
                profileImageUrl={result.profileImageUrl}
                size="md"
                level={result.level}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1c1c1c] text-sm">{result.nickname}</p>
                <p className="text-xs text-[#737373]">@{result.username}</p>
              </div>

              {/* 상태별 버튼 */}
              {result.status === 'FRIEND' ? (
                <div className="flex items-center gap-1 text-[#94B9F3] text-xs font-medium">
                  <UserCheck size={14} />
                  <span>친구</span>
                </div>
              ) : result.status === 'PENDING_SENT' || sent ? (
                <span className="text-xs text-[#737373] font-medium">요청 전송됨</span>
              ) : result.status === 'PENDING_RECEIVED' ? (
                <span className="text-xs text-[#737373] font-medium">요청 받음</span>
              ) : (
                <button
                  onClick={handleSendRequest}
                  disabled={sending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8D0FA] text-[#1c1c1c] text-xs font-semibold disabled:opacity-60 active:scale-95 transition-transform"
                >
                  {sending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <UserPlus size={12} />
                  )}
                  요청 보내기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
