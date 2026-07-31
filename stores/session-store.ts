import { create } from "zustand";
import { RestoreStage } from "@/core/session/restore-plan";
import type { SessionSnapshot } from "@/core/session/session-types";

/** asking → the dialog is up; the desktop underneath is already usable. */
export type SessionPhase = "booting" | "asking" | "restoring" | "ready";

interface SessionStore {
  phase: SessionPhase;
  stage: RestoreStage;
  snapshot: SessionSnapshot | null;
  awayMs: number;
  ask: (snapshot: SessionSnapshot, awayMs: number) => void;
  beginRestore: () => void;
  setStage: (stage: RestoreStage) => void;
  finish: () => void;
}

export const useSessionStore = create<SessionStore>()((set) => ({
  phase: "booting",
  stage: RestoreStage.Idle,
  snapshot: null,
  awayMs: 0,

  ask: (snapshot, awayMs) => set({ phase: "asking", snapshot, awayMs }),
  beginRestore: () => set({ phase: "restoring", stage: RestoreStage.Desktop }),
  setStage: (stage) => set({ stage }),
  finish: () => set({ phase: "ready", stage: RestoreStage.Done }),
}));
