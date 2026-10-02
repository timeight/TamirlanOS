import { supabase } from "@/core/vk/supabase";
import type { FriendState } from "@/core/vk/social-types";
import type { VkProfileRow } from "@/core/vk/vk-types";

export async function fetchFriendState(target: string): Promise<FriendState> {
  const { data } = await supabase.rpc("friend_state", { target });
  return (data as FriendState | null) ?? "none";
}

/** Состояние сразу для списка — поиск рисует кнопку в каждой строке. */
export async function fetchFriendStates(
  targets: readonly string[],
): Promise<Record<string, FriendState>> {
  if (targets.length === 0) return {};
  const { data } = await supabase.rpc("friend_states", { targets });
  const rows = (data as { target: string; state: FriendState }[] | null) ?? [];
  const map: Record<string, FriendState> = {};
  for (const row of rows) map[row.target] = row.state;
  return map;
}

export async function fetchFriends(
  owner: string,
): Promise<readonly VkProfileRow[]> {
  const { data } = await supabase.rpc("friends_of", { owner });
  return (data as VkProfileRow[] | null) ?? [];
}

export async function fetchFriendCount(owner: string): Promise<number> {
  const { data } = await supabase.rpc("friend_count", { owner });
  return (data as number | null) ?? 0;
}

export async function fetchMutualFriends(
  target: string,
): Promise<readonly VkProfileRow[]> {
  const { data } = await supabase.rpc("mutual_friends", { target });
  return (data as VkProfileRow[] | null) ?? [];
}

export async function fetchIncomingRequests(): Promise<
  readonly VkProfileRow[]
> {
  const { data } = await supabase.rpc("incoming_requests");
  return (data as VkProfileRow[] | null) ?? [];
}

export async function fetchOutgoingRequests(): Promise<
  readonly VkProfileRow[]
> {
  const { data } = await supabase.rpc("outgoing_requests");
  return (data as VkProfileRow[] | null) ?? [];
}

/**
 * Входящие заявки помечаются просмотренными: это не то же самое, что
 * принять их — заявка остаётся в списке, гаснет только счётчик.
 */
export async function markRequestsSeen(receiver: string): Promise<void> {
  await supabase
    .from("friendships")
    .update({ seen_at: new Date().toISOString() })
    .eq("receiver_id", receiver)
    .eq("status", "pending")
    .is("seen_at", null);
}

export async function acceptRequest(requester: string): Promise<string | null> {
  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("requester_id", requester)
    .eq("status", "pending");
  return error?.message ?? null;
}

/** Отказ и разрыв — одно и то же действие: строка просто исчезает. */
export async function removeFriendship(other: string): Promise<string | null> {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .or(`requester_id.eq.${other},receiver_id.eq.${other}`);
  return error?.message ?? null;
}

/**
 * Встречная заявка превращается в дружбу, иначе отправляется новая:
 * иначе два человека, нажавшие кнопку одновременно, застряли бы.
 */
export async function requestFriendship(
  me: string,
  target: string,
): Promise<string | null> {
  if (me === target) return "Нельзя добавить себя";
  if ((await fetchFriendState(target)) === "incoming_pending") {
    return acceptRequest(target);
  }
  const { error } = await supabase
    .from("friendships")
    .insert({ requester_id: me, receiver_id: target });
  return error?.message ?? null;
}

export async function applyFriendAction(
  me: string,
  target: string,
  state: FriendState,
): Promise<string | null> {
  if (state === "none") return requestFriendship(me, target);
  if (state === "incoming_pending") return acceptRequest(target);
  return removeFriendship(target);
}
