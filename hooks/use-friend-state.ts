"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyFriendAction,
  fetchFriendCount,
  fetchFriendState,
  fetchMutualFriends,
  removeFriendship,
} from "@/core/vk/api/friends";
import type { FriendState } from "@/core/vk/social-types";
import type { VkProfileRow } from "@/core/vk/vk-types";

export interface FriendLink {
  state: FriendState;
  friendCount: number;
  mutual: readonly VkProfileRow[];
  busy: boolean;
  /** Основное действие: отправить, отменить, принять или удалить. */
  act: () => Promise<void>;
  /** Отклонить входящую заявку — отдельная кнопка рядом с «Принять». */
  decline: () => Promise<void>;
}

/** Всё, что кнопка дружбы в профиле знает о паре «я — он». */
export function useFriendState(viewerId: string, targetId: string): FriendLink {
  const [state, setState] = useState<FriendState>("none");
  const [friendCount, setFriendCount] = useState(0);
  const [mutual, setMutual] = useState<readonly VkProfileRow[]>([]);
  const [busy, setBusy] = useState(false);

  const self = viewerId === targetId;

  const reload = useCallback(async () => {
    const [next, count, shared] = await Promise.all([
      self ? Promise.resolve<FriendState>("none") : fetchFriendState(targetId),
      fetchFriendCount(targetId),
      self ? Promise.resolve([]) : fetchMutualFriends(targetId),
    ]);
    setState(next);
    setFriendCount(count);
    setMutual(shared);
  }, [self, targetId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const act = useCallback(async () => {
    if (self || busy) return;
    setBusy(true);
    await applyFriendAction(viewerId, targetId, state);
    await reload();
    setBusy(false);
  }, [busy, reload, self, state, targetId, viewerId]);

  const decline = useCallback(async () => {
    if (self || busy) return;
    setBusy(true);
    await removeFriendship(targetId);
    await reload();
    setBusy(false);
  }, [busy, reload, self, targetId]);

  return { state, friendCount, mutual, busy, act, decline };
}
