import { create } from "zustand";
import type { VkProfileRow } from "@/core/vk/vk-types";

export type SessionStatus = "loading" | "guest" | "signed-in";

interface VkSessionStore {
  status: SessionStatus;
  userId: string | null;
  profile: VkProfileRow | null;
  setGuest: () => void;
  setUser: (userId: string, profile: VkProfileRow | null) => void;
  setProfile: (profile: VkProfileRow) => void;
}

export const useVkSessionStore = create<VkSessionStore>()((set) => ({
  status: "loading",
  userId: null,
  profile: null,

  setGuest: () => set({ status: "guest", userId: null, profile: null }),
  setUser: (userId, profile) => set({ status: "signed-in", userId, profile }),
  setProfile: (profile) => set({ profile }),
}));
