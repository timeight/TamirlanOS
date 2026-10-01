import { supabase } from "@/core/vk/supabase";
import type { VkProfileRow } from "@/core/vk/vk-types";

export interface SignUpInput {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

/** The trigger on auth.users reads this metadata to seed the profile row. */
export async function signUp(input: SignUpInput): Promise<string | null> {
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        username: input.username.toLowerCase(),
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  });
  return error?.message ?? null;
}

export async function signIn(
  email: string,
  password: string,
): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function fetchProfile(id: string): Promise<VkProfileRow | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as VkProfileRow | null;
}

export async function fetchProfileByUsername(
  username: string,
): Promise<VkProfileRow | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  return data as VkProfileRow | null;
}

export type ProfilePatch = Partial<
  Pick<
    VkProfileRow,
    | "first_name"
    | "last_name"
    | "city"
    | "website"
    | "activity"
    | "birthday"
    | "relationship_status"
    | "avatar_url"
  >
>;

export async function updateProfile(
  id: string,
  patch: ProfilePatch,
): Promise<string | null> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  return error?.message ?? null;
}

export async function searchProfiles(
  query: string,
): Promise<readonly VkProfileRow[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,username.ilike.%${term}%`,
    )
    .limit(30);
  return (data as VkProfileRow[] | null) ?? [];
}
