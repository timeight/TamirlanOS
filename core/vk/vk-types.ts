export interface VkProfileRow {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  birthday: string | null;
  city: string | null;
  website: string | null;
  activity: string | null;
  relationship_status: string | null;
  relationship_partner_id: string | null;
  created_at: string;
  privacy_requests: PrivacyRequests;
  privacy_messages: PrivacyScope;
  privacy_photos: PrivacyScope;
  privacy_posts: PrivacyScope;
  notify_friend_request: boolean;
  notify_like: boolean;
  notify_comment: boolean;
  notify_message: boolean;
}

/** «Никто» для записей и фотографий означает «только я». */
export type PrivacyScope = "all" | "friends" | "none";
export type PrivacyRequests = "all" | "friends_of_friends" | "none";

export interface VkCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: VkProfileRow | null;
}

export interface VkPostPhoto {
  id: string;
  storage_path: string;
  caption: string | null;
}

export interface VkPostRow {
  id: string;
  author_id: string;
  wall_owner_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: VkProfileRow | null;
  photo: VkPostPhoto | null;
  likes: { user_id: string }[];
  comments: VkCommentRow[];
}

/** What the wall actually renders, after counts are folded in. */
export interface VkWallPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
  photoUrl: string | null;
  photoCaption: string | null;
  likes: number;
  liked: boolean;
  comments: VkCommentRow[];
  mine: boolean;
  onMyWall: boolean;
}

export const RELATIONSHIP_LABELS: Record<string, string> = {
  not_specified: "не указано",
  single: "не женат / не замужем",
  dating: "встречаюсь",
  engaged: "помолвлен(а)",
  married: "женат / замужем",
  complicated: "всё сложно",
  in_love: "влюблён(а)",
};

export function fullName(
  profile: Pick<VkProfileRow, "first_name" | "last_name">,
): string {
  return `${profile.first_name} ${profile.last_name}`.trim();
}

/** VK wrote dates as "сегодня в 14:32" rather than an ISO stamp. */
export function vkDate(iso: string): string {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return `сегодня в ${time}`;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `вчера в ${time}`;
  }
  const day = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
  return `${day.replace(".", "")} в ${time}`;
}
