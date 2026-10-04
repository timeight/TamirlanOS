"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPostWallOwner } from "@/core/vk/api/posts";
import { fetchProfile } from "@/core/vk/api/profiles";
import { VK_SECTION } from "@/core/vk/sections";
import type { VkCounters } from "@/core/vk/social-types";
import type { VkProfileRow } from "@/core/vk/vk-types";
import { useVkCounters } from "@/hooks/use-vk-counters";
import { useVkMessages, type VkMessenger } from "@/hooks/use-vk-messages";
import { useVkSession } from "@/hooks/use-vk-session";
import {
  useVkSessionStore,
  type SessionStatus,
} from "@/stores/vk-session-store";

export interface VkApp {
  status: SessionStatus;
  userId: string | null;
  me: VkProfileRow | null;
  /** Чья страница на экране: своя, пока не открыли чужую. */
  shown: VkProfileRow | null;
  section: string;
  setSection: (section: string) => void;
  openProfile: (profileId: string) => Promise<void>;
  /** Открыть переписку с человеком из любого списка. */
  write: (profileId: string) => Promise<void>;
  /** Открыть стену с нужной записью — переход из уведомления. */
  openPost: (postId: string) => Promise<void>;
  /** Запись, к которой нужно прокрутить стену; гаснет после показа. */
  focusPostId: string | null;
  counters: VkCounters;
  /** Зовётся разделом после того, как он пометил что-то прочитанным. */
  refreshCounters: () => Promise<void>;
  messenger: VkMessenger;
}

/**
 * Всё состояние VK живёт здесь, поэтому desktop и mobile отличаются только
 * разметкой. Монтируется по одному разу на оболочку; одновременно не бывает.
 */
export function useVkApp(): VkApp {
  useVkSession();
  const status = useVkSessionStore((state) => state.status);
  const userId = useVkSessionStore((state) => state.userId);
  const me = useVkSessionStore((state) => state.profile);

  const [section, setSection] = useState<string>(VK_SECTION.profile);
  const [viewing, setViewing] = useState<VkProfileRow | null>(null);
  const [focusPostId, setFocusPostId] = useState<string | null>(null);

  const { counters, refresh: refreshCounters } = useVkCounters(userId);
  const messenger = useVkMessages(userId, refreshCounters);

  // Своя страница — единственный раздел, который помнит чужой профиль.
  useEffect(() => {
    if (section === VK_SECTION.profile) return;
    if (section === VK_SECTION.friends) return;
    if (section === VK_SECTION.photos) return;
    setViewing(null);
  }, [section]);

  const openProfile = useCallback(
    async (profileId: string) => {
      setSection(VK_SECTION.profile);
      if (profileId === userId) {
        setViewing(null);
        return;
      }
      setViewing(await fetchProfile(profileId));
    },
    [userId],
  );

  const openPost = useCallback(
    async (postId: string) => {
      const owner = await fetchPostWallOwner(postId);
      if (!owner) return;
      setSection(VK_SECTION.profile);
      setViewing(owner === userId ? null : await fetchProfile(owner));
      setFocusPostId(postId);
    },
    [userId],
  );

  const write = useCallback(
    async (profileId: string) => {
      setSection(VK_SECTION.messages);
      await messenger.openWith(profileId);
    },
    [messenger],
  );

  return {
    status,
    userId,
    me,
    shown: viewing ?? me,
    section,
    setSection,
    openProfile,
    write,
    openPost,
    focusPostId,
    counters,
    refreshCounters,
    messenger,
  };
}
