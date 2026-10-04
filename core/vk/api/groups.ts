import { escapeLike, friendly, quoteFilterValue } from "@/core/vk/api/errors";
import { supabase } from "@/core/vk/supabase";
import type {
  GroupRole,
  VkGroupListed,
  VkGroupRow,
  VkProfileRow,
} from "@/core/vk/vk-types";

export interface GroupMember {
  role: GroupRole;
  profile: VkProfileRow;
}

export async function fetchMyGroups(
  userId: string,
): Promise<readonly VkGroupRow[]> {
  const { data } = await supabase
    .from("group_members")
    .select("groups(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const rows = (data as unknown as { groups: VkGroupRow }[] | null) ?? [];
  return rows.map((row) => row.groups).filter(Boolean);
}

export async function fetchGroup(id: string): Promise<VkGroupRow | null> {
  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as VkGroupRow | null) ?? null;
}

export async function fetchGroupRole(id: string): Promise<GroupRole | null> {
  const { data } = await supabase.rpc("group_role", { group_key: id });
  return (data as GroupRole | null) ?? null;
}

export async function fetchMemberCount(id: string): Promise<number> {
  const { data } = await supabase.rpc("group_member_count", { group_key: id });
  return (data as number | null) ?? 0;
}

export async function fetchMembers(
  id: string,
): Promise<readonly GroupMember[]> {
  const { data } = await supabase
    .from("group_members")
    .select("role, profile:profiles(*)")
    .eq("group_id", id)
    .order("created_at", { ascending: true });
  return (data as unknown as GroupMember[] | null) ?? [];
}

export async function popularGroups(
  limit = 10,
): Promise<readonly VkGroupListed[]> {
  const { data } = await supabase.rpc("popular_groups", { want: limit });
  return (data as VkGroupListed[] | null) ?? [];
}

/** Экранирование то же, что в поиске людей: запятая не должна рвать фильтр. */
export async function searchGroups(
  query: string,
): Promise<readonly VkGroupRow[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  const pattern = quoteFilterValue(`%${escapeLike(term)}%`);
  const { data } = await supabase
    .from("groups")
    .select("*")
    .or(`name.ilike.${pattern},username.ilike.${pattern}`)
    .limit(30);
  return (data as VkGroupRow[] | null) ?? [];
}

export interface NewGroup {
  name: string;
  username: string;
  description: string;
}

/** Владельцем создателя делает триггер в базе, а не этот запрос. */
export async function createGroup(
  ownerId: string,
  input: NewGroup,
): Promise<{ id: string } | string> {
  const username = input.username.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return "Адрес: латиница, цифры и подчёркивание, 3–20 знаков";
  }
  if (input.name.trim().length < 2) return "Слишком короткое название";

  const { data, error } = await supabase
    .from("groups")
    .insert({
      owner_id: ownerId,
      username,
      name: input.name.trim(),
      description: input.description.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return error?.message.includes("duplicate")
      ? "Такой адрес уже занят"
      : (friendly(error) ?? "Не удалось создать сообщество");
  }
  return data as { id: string };
}

export async function joinGroup(
  groupId: string,
  userId: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_id: userId, role: "member" });
  return friendly(error);
}

export async function leaveGroup(
  groupId: string,
  userId: string,
): Promise<string | null> {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  return friendly(error);
}

export async function setMemberRole(
  groupId: string,
  userId: string,
  role: Exclude<GroupRole, "owner">,
): Promise<string | null> {
  const { error } = await supabase
    .from("group_members")
    .update({ role })
    .eq("group_id", groupId)
    .eq("user_id", userId);
  return friendly(error);
}

export type GroupPatch = Partial<
  Pick<VkGroupRow, "name" | "description" | "avatar_url">
>;

export async function updateGroup(
  groupId: string,
  patch: GroupPatch,
): Promise<string | null> {
  const { error } = await supabase
    .from("groups")
    .update(patch)
    .eq("id", groupId);
  return friendly(error);
}

export async function deleteGroup(groupId: string): Promise<string | null> {
  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  return friendly(error);
}
