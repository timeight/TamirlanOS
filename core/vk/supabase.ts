import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False when the build had no credentials; the UI then shows a setup notice. */
export const vkConfigured = Boolean(url && anonKey);

/**
 * Placeholders keep createClient from throwing at import time on a build
 * without credentials — every call then fails loudly instead of silently.
 */
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "tamirlanos:vk-auth",
    },
  },
);
