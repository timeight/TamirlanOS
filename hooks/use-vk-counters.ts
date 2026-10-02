"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCounters } from "@/core/vk/api/notifications";
import { EMPTY_COUNTERS, type VkCounters } from "@/core/vk/social-types";
import { supabase } from "@/core/vk/supabase";

/** Счётчики без списка: сайдбару не нужны шестьдесят строк уведомлений. */
export function useVkCounters(viewerId: string | null): VkCounters {
  const [counters, setCounters] = useState<VkCounters>(EMPTY_COUNTERS);

  const reload = useCallback(async () => {
    if (!viewerId) {
      setCounters(EMPTY_COUNTERS);
      return;
    }
    setCounters(await fetchCounters());
  }, [viewerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

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
        () => void reload(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reload, viewerId]);

  return counters;
}
