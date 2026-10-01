"use client";

import { useEffect } from "react";
import { fetchProfile } from "@/core/vk/api/profiles";
import { supabase, vkConfigured } from "@/core/vk/supabase";
import { useVkSessionStore } from "@/stores/vk-session-store";

/**
 * Single subscription to Supabase auth. Mounted once by the VK page, so the
 * profile is loaded in one place and every screen reads the same store.
 */
export function useVkSession(): void {
  useEffect(() => {
    if (!vkConfigured) {
      useVkSessionStore.getState().setGuest();
      return;
    }

    let active = true;

    const apply = async (userId: string | null) => {
      const store = useVkSessionStore.getState();
      if (!userId) {
        store.setGuest();
        return;
      }
      const profile = await fetchProfile(userId);
      if (active) store.setUser(userId, profile);
    };

    void supabase.auth
      .getSession()
      .then(({ data }) => apply(data.session?.user.id ?? null));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void apply(session?.user.id ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
}
