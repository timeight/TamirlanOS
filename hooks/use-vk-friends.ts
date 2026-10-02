"use client";

import { useCallback, useEffect, useState } from "react";
import {
  acceptRequest,
  fetchFriends,
  fetchIncomingRequests,
  fetchOutgoingRequests,
  markRequestsSeen,
  removeFriendship,
} from "@/core/vk/api/friends";
import type { VkProfileRow } from "@/core/vk/vk-types";

export interface VkFriends {
  friends: readonly VkProfileRow[];
  incoming: readonly VkProfileRow[];
  outgoing: readonly VkProfileRow[];
  loading: boolean;
  /** Принять входящую заявку. */
  accept: (requester: string) => Promise<void>;
  /** Отклонить, отменить исходящую или удалить из друзей — одно действие. */
  drop: (other: string) => Promise<void>;
  /** Пометить входящие заявки просмотренными; из списка они не исчезают. */
  markSeen: () => Promise<void>;
  reload: () => Promise<void>;
}

/** Заявки грузятся только для своей страницы: чужие не видны по RLS. */
export function useVkFriends(
  ownerId: string,
  viewerId: string,
  onCountersChanged: () => Promise<void>,
): VkFriends {
  const [friends, setFriends] = useState<readonly VkProfileRow[]>([]);
  const [incoming, setIncoming] = useState<readonly VkProfileRow[]>([]);
  const [outgoing, setOutgoing] = useState<readonly VkProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const mine = ownerId === viewerId;

  const reload = useCallback(async () => {
    setLoading(true);
    const [list, inbox, sent] = await Promise.all([
      fetchFriends(ownerId),
      mine ? fetchIncomingRequests() : Promise.resolve([]),
      mine ? fetchOutgoingRequests() : Promise.resolve([]),
    ]);
    setFriends(list);
    setIncoming(inbox);
    setOutgoing(sent);
    setLoading(false);
  }, [mine, ownerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const accept = useCallback(
    async (requester: string) => {
      await acceptRequest(requester);
      await reload();
      await onCountersChanged();
    },
    [onCountersChanged, reload],
  );

  const drop = useCallback(
    async (other: string) => {
      await removeFriendship(other);
      await reload();
      await onCountersChanged();
    },
    [onCountersChanged, reload],
  );

  // Список не перечитывается: заявка остаётся на месте, гаснет только счётчик.
  const markSeen = useCallback(async () => {
    if (!mine) return;
    await markRequestsSeen(viewerId);
    await onCountersChanged();
  }, [mine, onCountersChanged, viewerId]);

  return {
    friends,
    incoming,
    outgoing,
    loading,
    accept,
    drop,
    markSeen,
    reload,
  };
}
