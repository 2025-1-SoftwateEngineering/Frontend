import { useState, useCallback } from 'react';
import type { FriendItem, FriendRequestItem } from './friendTypes';
import { memberApi } from '../member/memberApi';

export function useFriendStore() {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [requests, setRequests] = useState<FriendRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await memberApi.getFriends('-1', 50);
      const accepted = (res.data ?? []).filter((f) => f.state === 'ACCEPTED');
      const profiles = await Promise.all(
        accepted.map((f) => memberApi.getFriendProfile(f.toMemberId)),
      );
      setFriends(
        profiles.map((p) => ({
          memberId:        p.id,
          username:        '',
          nickname:        p.nickname,
          profileImageUrl: undefined,
          level:           0,
          status:          'FRIEND' as const,
        })),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await memberApi.getFriendRequests('-1', 50);
      // WAITING 상태만 표시 (아직 처리 안 된 요청)
      const waiting = (res.data ?? []).filter((r) => r.state === 'WAITING');
      setRequests(
        waiting.map((r) => ({
          requestId: r.fromMemberId, // PATCH /friends/{fromMemberId} 와 맞춤
          sender: {
            memberId:        r.fromMemberId,
            username:        '',
            nickname:        r.nickname,
            profileImageUrl: undefined,
            level:           0,
          },
          createdAt: '',
        })),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAccept = useCallback(async (fromMemberId: number) => {
    await memberApi.updateFriendRequest(fromMemberId, 'accept');
    setRequests((prev) => prev.filter((r) => r.requestId !== fromMemberId));
    await loadFriends();
  }, [loadFriends]);

  const handleReject = useCallback(async (fromMemberId: number) => {
    await memberApi.updateFriendRequest(fromMemberId, 'reject');
    setRequests((prev) => prev.filter((r) => r.requestId !== fromMemberId));
  }, []);

  const handleDelete = useCallback(async (memberId: number) => {
    await memberApi.deleteFriend(memberId);
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleBlock = useCallback(async (memberId: number) => {
    await memberApi.blockFriend(memberId);
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleSendRequest = useCallback(async (targetMemberId: number) => {
    await memberApi.sendFriendRequest(targetMemberId);
  }, []);

  return {
    friends, requests, loading, error,
    loadFriends, loadRequests,
    handleAccept, handleReject, handleDelete, handleBlock, handleSendRequest,
  };
}
