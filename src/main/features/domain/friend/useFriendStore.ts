// ─────────────────────────────────────────────
//  친구 상태 관리 훅 (useFriendStore)
// ─────────────────────────────────────────────

import { useState, useCallback } from 'react';
import type { FriendItem, FriendRequestItem } from './friendTypes';

//테스트용 임시 데이터
const MOCK_FRIENDS: FriendItem[] = [
  {
    memberId: 2,
    username: 'friend1@test.com',
    nickname: '친구1',
    level: 3,
    status: 'FRIEND',
  },
  {
    memberId: 3,
    username: 'friend2@test.com',
    nickname: '친구2',
    level: 7,
    status: 'FRIEND',
  },
];

const MOCK_REQUESTS: FriendRequestItem[] = [
  {
    requestId: 1,
    sender: {
      memberId: 4,
      username: 'newuser@test.com',
      nickname: '새친구',
      level: 1,
    },
    createdAt: new Date().toISOString(),
  },
];

export function useFriendStore() {
  const [friends, setFriends] = useState<FriendItem[]>(MOCK_FRIENDS);
  const [requests, setRequests] = useState<FriendRequestItem[]>(MOCK_REQUESTS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {}, []);
  const loadRequests = useCallback(async () => {}, []);

  const handleAccept = useCallback(async (requestId: number) => {
    const req = requests.find((r) => r.requestId === requestId);
    if (req) {
      setFriends((prev) => [...prev, {
        memberId: req.sender.memberId,
        username: req.sender.username,
        nickname: req.sender.nickname,
        level: req.sender.level,
        status: 'FRIEND',
      }]);
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    }
  }, [requests]);

  const handleReject = useCallback(async (requestId: number) => {
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  }, []);

  const handleDelete = useCallback(async (memberId: number) => {
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleBlock = useCallback(async (memberId: number) => {
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleSendRequest = useCallback(async (_targetMemberId: number) => {}, []);

  return {
    friends, requests, loading, error,
    loadFriends, loadRequests,
    handleAccept, handleReject, handleDelete, handleBlock, handleSendRequest,
  };
}

/*
 import {
  getFriendList,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  blockUser,
  sendFriendRequest,
} from './friendApi';

export function useFriendStore() {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [requests, setRequests] = useState<FriendRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFriendList();
      if (res.isSuccess) setFriends(res.result);
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
      const res = await getFriendRequests();
      if (res.isSuccess) setRequests(res.result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAccept = useCallback(async (requestId: number) => {
    await acceptFriendRequest(requestId);
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    await loadFriends();
  }, [loadFriends]);

  const handleReject = useCallback(async (requestId: number) => {
    await rejectFriendRequest(requestId);
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  }, []);

  const handleDelete = useCallback(async (memberId: number) => {
    await deleteFriend(memberId);
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleBlock = useCallback(async (memberId: number) => {
    await blockUser(memberId);
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  const handleSendRequest = useCallback(async (targetMemberId: number) => {
    await sendFriendRequest(targetMemberId);
  }, []);

  return {
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
    handleSendRequest,
  };
}

*/
