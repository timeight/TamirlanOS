"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCounters } from "@/core/vk/api/notifications";
import { EMPTY_COUNTERS, type VkCounters } from "@/core/vk/social-types";
import { supabase } from "@/core/vk/supabase";

export interface VkCounterFeed {
  counters: VkCounters;
  /** Разделы зовут это после того, как пометили что-то прочитанным. */
  refresh: () => Promise<void>;
}

/** Счётчики без списка: сайдбару не нужны шестьдесят строк уведомлений. */
export function useVkCounters(viewerId: string | null): VkCounterFeed {
  const [counters, setCounters] = useState<VkCounters>(EMPTY_COUNTERS);

  const refresh = useCallback(async () => {
    if (!viewerId) {
      setCounters(EMPTY_COUNTERS);
      return;
    }
    setCounters(await fetchCounters());
  }, [viewerId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Новое событие приходит сюда само; прочитанность приезжает через refresh,
  // потому что realtime может быть выключен, а счётчик гаснуть обязан.
  useEffect(() => {
    if (!viewerId) return;
    const channel = supabase
      .channel(`vk-counters-${viewerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${viewerId}`,
        },
        () => void refresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `receiver_id=eq.${viewerId}`,
        },
        () => void refresh(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh, viewerId]);

  return { counters, refresh };
}
