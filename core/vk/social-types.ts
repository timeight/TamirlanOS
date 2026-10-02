import type { VkProfileRow } from "@/core/vk/vk-types";

/** Считается в базе функцией friend_state, не выводится на клиенте. */
export type FriendState =
  "none" | "outgoing_pending" | "incoming_pending" | "friends";

export interface VkDialog {
  conversationId: string;
  other: Pick<
    VkProfileRow,
    "id" | "username" | "first_name" | "last_name" | "avatar_url"
  >;
  lastContent: string | null;
  lastCreatedAt: string | null;
  lastAuthorId: string | null;
  unread: number;
}

export interface VkMessageRow {
  id: string;
  conversation_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface VkPhotoRow {
  id: string;
  album_id: string;
  owner_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
}

export type NotificationKind =
  | "friend_request"
  | "friend_accepted"
  | "post_like"
  | "post_comment"
  | "message";

export interface VkNotificationRow {
  id: string;
  user_id: string;
  actor_id: string;
  kind: NotificationKind;
  post_id: string | null;
  conversation_id: string | null;
  is_read: boolean;
  created_at: string;
  actor: VkProfileRow | null;
}

export interface VkCounters {
  friendRequests: number;
  unreadMessages: number;
  unreadNotifications: number;
}

export const EMPTY_COUNTERS: VkCounters = {
  friendRequests: 0,
  unreadMessages: 0,
  unreadNotifications: 0,
};

export const NOTIFICATION_TEXT: Record<NotificationKind, string> = {
  friend_request: "хочет добавить Вас в друзья",
  friend_accepted: "принял Вашу заявку в друзья",
  post_like: "оценил Вашу запись",
  post_comment: "оставил комментарий к Вашей записи",
  message: "написал Вам сообщение",
};

/** Подпись под кнопкой дружбы повторяет формулировки 2012 года. */
export const FRIEND_ACTION: Record<FriendState, string> = {
  none: "Добавить в друзья",
  outgoing_pending: "Отменить заявку",
  incoming_pending: "Принять заявку",
  friends: "Удалить из друзей",
};
