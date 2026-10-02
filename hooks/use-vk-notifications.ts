"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearNotifications,
  fetchNotifications,
  markNotificationsRead,
} from "@/core/vk/api/notifications";
import type { VkNotificationRow } from "@/core/vk/social-types";

export interface VkNotificationFeed {
  items: readonly VkNotificationRow[];
  loading: boolean;
  markAllRead: () => Promise<void>;
  clearRead: () => Promise<void>;
}

export function useVkNotifications(): VkNotificationFeed {
  const [items, setItems] = useState<readonly VkNotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setItems(await fetchNotifications());
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const markAllRead = useCallback(async () => {
    await markNotificationsRead();
    await reload();
  }, [reload]);

  const clearRead = useCallback(async () => {
    await clearNotifications();
    await reload();
  }, [reload]);

  return { items, loading, markAllRead, clearRead };
}
