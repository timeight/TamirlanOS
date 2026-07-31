import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SKIN } from "@/core/pet/pet-skins";
import type { PetVector } from "@/core/pet/pet-types";

export const FRIENDSHIP_MAX = 100;

interface PetStore {
  enabled: boolean;
  friendship: number;
  skinId: string;
  position: PetVector;
  lastVisit: number;
  lastSpokeAt: number;
  metPix: boolean;
  toggleEnabled: () => void;
  addFriendship: (amount: number) => void;
  setSkin: (id: string) => void;
  savePosition: (position: PetVector) => void;
  markSpoke: () => void;
  markMet: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      friendship: 0,
      skinId: DEFAULT_SKIN.id,
      position: { x: 120, y: 220 },
      lastVisit: Date.now(),
      lastSpokeAt: 0,
      metPix: false,

      toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),

      addFriendship: (amount) =>
        set({
          friendship: Math.min(FRIENDSHIP_MAX, get().friendship + amount),
        }),

      setSkin: (skinId) => set({ skinId }),
      savePosition: (position) => set({ position }),
      markSpoke: () => set({ lastSpokeAt: Date.now() }),
      markMet: () => set({ metPix: true, lastVisit: Date.now() }),
    }),
    { name: "tamirlanos-pix" },
  ),
);
