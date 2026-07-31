import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ageHabits,
  createHabits,
  reinforceApp,
  reinforcePlace,
  type HabitTable,
} from "@/core/pet/habit-engine";
import { DEFAULT_SKIN } from "@/core/pet/pet-skins";
import type { PetVector } from "@/core/pet/pet-types";

export const FRIENDSHIP_MAX = 100;
const RETURN_GAP_MS = 6 * 60 * 60 * 1000;

interface PetStore {
  enabled: boolean;
  friendship: number;
  skinId: string;
  position: PetVector;
  lastVisit: number;
  lastSpokeAt: number;
  metPix: boolean;
  habits: HabitTable;
  lastApp: string | null;
  secretsFound: string[];
  /** True for one session when the visitor comes back after a long gap. */
  returning: boolean;
  toggleEnabled: () => void;
  addFriendship: (amount: number) => void;
  setSkin: (id: string) => void;
  savePosition: (position: PetVector) => void;
  markSpoke: () => void;
  markMet: () => void;
  notePlace: (nodeId: string) => void;
  noteApp: (appId: string) => void;
  noteSecret: (id: string) => void;
  beginVisit: () => void;
  clearReturning: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      friendship: 0,
      skinId: DEFAULT_SKIN.id,
      position: { x: 220, y: 260 },
      lastVisit: Date.now(),
      lastSpokeAt: 0,
      metPix: false,
      habits: createHabits(),
      lastApp: null,
      secretsFound: [],
      returning: false,

      toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),

      addFriendship: (amount) =>
        set({
          friendship: Math.min(FRIENDSHIP_MAX, get().friendship + amount),
        }),

      setSkin: (skinId) => set({ skinId }),
      savePosition: (position) => set({ position }),
      markSpoke: () => set({ lastSpokeAt: Date.now() }),
      markMet: () => set({ metPix: true }),

      notePlace: (nodeId) =>
        set((state) => ({ habits: reinforcePlace(state.habits, nodeId) })),

      noteApp: (appId) =>
        set((state) => ({
          habits: reinforceApp(state.habits, appId),
          lastApp: appId,
        })),

      noteSecret: (id) =>
        set((state) =>
          state.secretsFound.includes(id)
            ? state
            : { secretsFound: [...state.secretsFound, id] },
        ),

      // Called once per page load: ages habits and detects a returning visitor.
      beginVisit: () =>
        set((state) => ({
          habits: ageHabits(state.habits),
          returning:
            state.metPix && Date.now() - state.lastVisit > RETURN_GAP_MS,
          lastVisit: Date.now(),
        })),

      clearReturning: () => set({ returning: false }),
    }),
    { name: "tamirlanos-pix" },
  ),
);
