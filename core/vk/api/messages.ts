import { supabase } from "@/core/vk/supabase";
import type { VkDialog, VkMessageRow } from "@/core/vk/social-types";

interface DialogRpcRow {
  conversation_id: string;
  other_id: string;
  other_username: string;
  other_first_name: string;
  other_last_name: string;
  other_avatar_url: string | null;
  last_content: string | null;
  last_created_at: string | null;
  last_author_id: string | null;
  unread: number;
}

function toDialog(row: DialogRpcRow): VkDialog {
  return {
    conversationId: row.conversation_id,
    other: {
      id: row.other_id,
      username: row.other_username,
      first_name: row.other_first_name,
      last_name: row.other_last_name,
      avatar_url: row.other_avatar_url,
    },
    lastContent: row.last_content,
    lastCreatedAt: row.last_created_at,
    lastAuthorId: row.last_author_id,
    unread: row.unread,
  };
}

export async function fetchDialogs(): Promise<readonly VkDialog[]> {
  const { data } = await supabase.rpc("my_conversations");
  return ((data as DialogRpcRow[] | null) ?? []).map(toDialog);
}

/** Диалог создаёт только база: прямая вставка в conversations запрещена. */
export async function openDialog(other: string): Promise<string | null> {
  const { data } = await supabase.rpc("direct_conversation", { other });
  return (data as string | null) ?? null;
}

export async function fetchMessages(
  conversationId: string,
): Promise<readonly VkMessageRow[]> {
  const { data } = await supabase
    .from("messages")
    .select("id, conversation_id, author_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(300);
  return (data as VkMessageRow[] | null) ?? [];
}

export async function sendMessage(
  conversationId: string,
  authorId: string,
  content: string,
): Promise<string | null> {
  const text = content.trim();
  if (!text) return "Пустое сообщение";
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    author_id: authorId,
    content: text,
  });
  return error?.message ?? null;
}

export async function deleteMessage(id: string): Promise<string | null> {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  return error?.message ?? null;
}

/** Открытие раздела «Мои сообщения» гасит счётчик по всем перепискам. */
export async function markAllRead(userId: string): Promise<void> {
  await supabase
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("user_id", userId);
}

export async function markRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  await supabase
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);
}
