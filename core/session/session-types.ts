import type { Bounds } from "@/types/geometry";

/** Bump when the snapshot shape changes; migration is keyed off this. */
export const SESSION_SCHEMA = 2;

export const SESSION_KEY = "tamirlanos:session";

export interface WindowSnapshot {
  appId: string;
  bounds: Bounds;
  /** Matches WindowState; kept as a string so core stays free of UI enums. */
  state: string;
}

export interface SessionSnapshot {
  version: number;
  savedAt: number;
  visits: number;
  windows: WindowSnapshot[];
  /** App ids bottom to top. */
  zOrder: string[];
  focusedApp: string | null;
  crtEnabled: boolean;
  theme: string | null;
}

export function emptySnapshot(): SessionSnapshot {
  return {
    version: SESSION_SCHEMA,
    savedAt: Date.now(),
    visits: 1,
    windows: [],
    zOrder: [],
    focusedApp: null,
    crtEnabled: true,
    theme: null,
  };
}

/** Buckets the welcome-back line, longest match first. */
export const AWAY_STEPS = [
  { days: 365, key: "session.away.365" },
  { days: 180, key: "session.away.180" },
  { days: 90, key: "session.away.90" },
  { days: 30, key: "session.away.30" },
  { days: 7, key: "session.away.7" },
  { days: 1, key: "session.away.1" },
] as const;

export function awayKey(awayMs: number): string {
  const days = awayMs / 86_400_000;
  return (
    AWAY_STEPS.find((step) => days >= step.days)?.key ?? "session.away.recent"
  );
}

export function awayDays(awayMs: number): number {
  return Math.max(0, Math.floor(awayMs / 86_400_000));
}
