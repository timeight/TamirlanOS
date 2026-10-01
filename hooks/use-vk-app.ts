"use client";

import { useCallback, useEffect, useState } from "react";
import { VK_NAV } from "@/core/browser/vk/vk-data";
import { fetchProfile } from "@/core/vk/api/profiles";
import type { VkProfileRow } from "@/core/vk/vk-types";
import { useVkSession } from "@/hooks/use-vk-session";
import {
  useVkSessionStore,
  type SessionStatus,
} from "@/stores/vk-session-store";

export const VK_MY_PAGE = VK_NAV[0]!;
export const VK_SEARCH = "Поиск людей";

export interface VkApp {
  status: SessionStatus;
  userId: string | null;
  me: VkProfileRow | null;
  /** Whose page is on screen: own profile unless another was opened. */
  shown: VkProfileRow | null;
  section: string;
  setSection: (section: string) => void;
  openProfile: (profileId: string) => Promise<void>;
}

/**
 * Every piece of VK state lives here so the desktop and mobile shells differ
 * in markup only. Mounted once per shell; both never render at the same time.
 */
export function useVkApp(): VkApp {
  useVkSession();
  const status = useVkSessionStore((state) => state.status);
  const userId = useVkSessionStore((state) => state.userId);
  const me = useVkSessionStore((state) => state.profile);

  const [section, setSection] = useState(VK_MY_PAGE);
  const [viewing, setViewing] = useState<VkProfileRow | null>(null);

  useEffect(() => {
    if (section === VK_MY_PAGE) return;
    setViewing(null);
  }, [section]);

  const openProfile = useCallback(
    async (profileId: string) => {
      setSection(VK_MY_PAGE);
      if (profileId === userId) {
        setViewing(null);
        return;
      }
      setViewing(await fetchProfile(profileId));
    },
    [userId],
  );

  return {
    status,
    userId,
    me,
    shown: viewing ?? me,
    section,
    setSection,
    openProfile,
  };
}
