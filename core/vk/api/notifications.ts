import { supabase } from "@/core/vk/supabase";
import type { VkCounters, VkNotificationRow } from "@/core/vk/social-types";
import { EMPTY_COUNTERS } from "@/core/vk/social-types";

interface CountersRpcRow {
  friend_requests: number;
  unread_messages: number;
  unread_notifications: number;
}

export async function fetchCounters(): Promise<VkCounters> {
  const { data } = await supabase.rpc("my_counters");
  const row = (data as CountersRpcRow[] | null)?.[0];
  if (!row) return EMPTY_COUNTERS;
  return {
    friendRequests: row.friend_requests,
    unreadMessages: row.unread_messages,
    unreadNotifications: row.unread_notifications,
  };
}

export async function fetchNotifications(): Promise<
  readonly VkNotificationRow[]
> {
  const { data } = await supabase
    .from("notifications")
    .select("*, actor:profiles!notifications_actor_id_fkey(*)")
    .order("created_at", { ascending: false })
    .limit(60);
  return (data as VkNotificationRow[] | null) ?? [];
}

export async function markNotificationsRead(): Promise<void> {
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
}

export async function clearNotifications(): Promise<void> {
  await supabase.from("notifications").delete().eq("is_read", true);
}
