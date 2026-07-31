import type { SessionSnapshot } from "@/core/session/session-types";

export enum RestoreStage {
  Idle = "idle",
  Desktop = "desktop",
  Taskbar = "taskbar",
  Windows = "windows",
  Companion = "companion",
  Done = "done",
}

/** Milliseconds each stage holds before the next one starts. */
export const STAGE_MS: Record<RestoreStage, number> = {
  [RestoreStage.Idle]: 0,
  [RestoreStage.Desktop]: 260,
  [RestoreStage.Taskbar]: 200,
  [RestoreStage.Windows]: 0,
  [RestoreStage.Companion]: 240,
  [RestoreStage.Done]: 0,
};

/** Gap between two windows coming back, so they arrive one by one. */
export const WINDOW_STAGGER_MS = 170;

export const STAGE_ORDER: readonly RestoreStage[] = [
  RestoreStage.Desktop,
  RestoreStage.Taskbar,
  RestoreStage.Windows,
  RestoreStage.Companion,
  RestoreStage.Done,
];

export function windowsPhaseMs(snapshot: SessionSnapshot): number {
  return snapshot.windows.length * WINDOW_STAGGER_MS;
}

export function totalRestoreMs(snapshot: SessionSnapshot): number {
  return (
    STAGE_MS[RestoreStage.Desktop] +
    STAGE_MS[RestoreStage.Taskbar] +
    windowsPhaseMs(snapshot) +
    STAGE_MS[RestoreStage.Companion]
  );
}
