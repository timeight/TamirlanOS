"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearNotifications,
  fetchNotifications,
  markNotificationsRead,
} from "@/core/vk/api/notifications";
import type { VkNotificationRow } from "@/core/vk/social-types";

export interface VkNotificationFeed {
  items: readonly VkNotificationRow[];
  loading: boolean;
  clearRead: () => Promise<void>;
}

/**
 * Открытый раздел и есть прочтение. Список после пометки не перечитывается:
 * иначе подсветка новых событий пропала бы прямо под курсором.
 */
export function useVkNotifications(
  onCountersChanged: () => Promise<void>,
): VkNotificationFeed {
  const [items, setItems] = useState<readonly VkNotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const marked = useRef(false);

  const reload = useCallback(async () => {
    const rows = await fetchNotifications();
    setItems(rows);
    setLoading(false);
    if (marked.current || rows.every((row) => row.is_read)) return;
    marked.current = true;
    await markNotificationsRead();
    await onCountersChanged();
  }, [onCountersChanged]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const clearRead = useCallback(async () => {
    await clearNotifications();
    await reload();
  }, [reload]);

  return { items, loading, clearRead };
}
