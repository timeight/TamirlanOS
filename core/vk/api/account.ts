import { friendly } from "@/core/vk/api/errors";
import { supabase } from "@/core/vk/supabase";
import type { PrivacyRequests, PrivacyScope } from "@/core/vk/vk-types";

export const MIN_PASSWORD = 6;

export interface PrivacyPatch {
  privacy_requests?: PrivacyRequests;
  privacy_audio?: PrivacyScope;
  privacy_messages?: PrivacyScope;
  privacy_photos?: PrivacyScope;
  privacy_posts?: PrivacyScope;
  notify_friend_request?: boolean;
  notify_like?: boolean;
  notify_comment?: boolean;
  notify_message?: boolean;
}

export type PrivacyKey = keyof PrivacyPatch;

export async function savePrivacy(
  userId: string,
  patch: PrivacyPatch,
): Promise<string | null> {
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId);
  return friendly(error);
}

export async function currentEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

/**
 * Пароль меняет Supabase Auth: в наших таблицах его нет и быть не должно.
 * Текущий пароль проверяется повторным входом — иначе открытая сессия
 * позволила бы сменить пароль любому, кто подсел за чужой экран.
 */
export async function changePassword(
  email: string,
  currentPassword: string,
  next: string,
  repeat: string,
): Promise<string | null> {
  if (next.length < MIN_PASSWORD) {
    return `Пароль должен быть не короче ${MIN_PASSWORD} знаков`;
  }
  if (next !== repeat) return "Пароли не совпадают";
  if (next === currentPassword) return "Новый пароль совпадает со старым";

  const check = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (check.error) return "Текущий пароль неверен";

  const { error } = await supabase.auth.updateUser({ password: next });
  return error ? friendly(error) : null;
}

/** Supabase шлёт письмо на новый адрес; до подтверждения остаётся старый. */
export async function changeEmail(next: string): Promise<string | null> {
  const value = next.trim();
  if (!value.includes("@")) return "Введите почтовый адрес";
  const { error } = await supabase.auth.updateUser({ email: value });
  return error ? friendly(error) : null;
}

/**
 * Удаляет всё, что принадлежит человеку в приложении. Запись в auth.users
 * остаётся: для неё нужен service_role, которому во фронтенде не место.
 */
export async function purgeAccount(): Promise<string | null> {
  const { error } = await supabase.rpc("purge_my_account");
  if (error) return friendly(error);
  await supabase.auth.signOut();
  return null;
}

export const PRIVACY_SCOPE_LABELS: Record<PrivacyScope, string> = {
  all: "Все пользователи",
  friends: "Только друзья",
  none: "Только я",
};

export const PRIVACY_MESSAGE_LABELS: Record<PrivacyScope, string> = {
  all: "Все пользователи",
  friends: "Только друзья",
  none: "Никто",
};

export const PRIVACY_REQUEST_LABELS: Record<PrivacyRequests, string> = {
  all: "Все пользователи",
  friends_of_friends: "Друзья друзей",
  none: "Никто",
};

export interface PrivacyRow {
  key: PrivacyKey;
  label: string;
  options: readonly { value: string; label: string }[];
}

function asOptions(source: Record<string, string>) {
  return Object.entries(source).map(([value, label]) => ({ value, label }));
}

export const PRIVACY_ROWS: readonly PrivacyRow[] = [
  {
    key: "privacy_requests",
    label: "Кто может отправлять мне заявки в друзья",
    options: asOptions(PRIVACY_REQUEST_LABELS),
  },
  {
    key: "privacy_messages",
    label: "Кто может писать мне сообщения",
    options: asOptions(PRIVACY_MESSAGE_LABELS),
  },
  {
    key: "privacy_posts",
    label: "Кто видит записи на моей стене",
    options: asOptions(PRIVACY_SCOPE_LABELS),
  },
  {
    key: "privacy_photos",
    label: "Кто видит мои фотографии",
    options: asOptions(PRIVACY_SCOPE_LABELS),
  },
  {
    key: "privacy_audio",
    label: "Кто слышит мои аудиозаписи",
    options: asOptions(PRIVACY_SCOPE_LABELS),
  },
];

export const NOTIFY_ROWS: readonly { key: PrivacyKey; label: string }[] = [
  { key: "notify_friend_request", label: "Заявки в друзья" },
  { key: "notify_like", label: "Отметки «мне нравится»" },
  { key: "notify_comment", label: "Комментарии" },
  { key: "notify_message", label: "Сообщения" },
];
