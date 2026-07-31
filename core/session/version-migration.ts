import {
  SESSION_SCHEMA,
  emptySnapshot,
  type SessionSnapshot,
} from "@/core/session/session-types";

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

/**
 * Keyed by the version being upgraded *from*. A session written by any older
 * build walks this chain until it reaches the current schema, so an update
 * never costs a visitor their history.
 */
const MIGRATIONS: Record<number, Migration> = {
  1: (raw) => ({ ...raw, crtEnabled: raw.crtEnabled ?? true, version: 2 }),
};

function isSnapshot(value: unknown): value is SessionSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<SessionSnapshot>;
  return (
    typeof candidate.version === "number" &&
    typeof candidate.savedAt === "number" &&
    Array.isArray(candidate.windows)
  );
}

/**
 * Returns a usable snapshot or null. Never throws: a corrupt session must
 * degrade to a fresh desktop, not to a broken one.
 */
export function migrate(value: unknown): SessionSnapshot | null {
  if (!isSnapshot(value)) return null;

  let raw = value as unknown as Record<string, unknown>;
  let guard = 0;
  while ((raw.version as number) < SESSION_SCHEMA && guard < 16) {
    const step = MIGRATIONS[raw.version as number];
    if (!step) return null;
    raw = step(raw);
    guard += 1;
  }
  if ((raw.version as number) !== SESSION_SCHEMA) return null;

  const base = emptySnapshot();
  const snapshot = raw as unknown as SessionSnapshot;
  return {
    ...base,
    ...snapshot,
    windows: snapshot.windows.filter(
      (window) => typeof window?.appId === "string" && window.bounds != null,
    ),
    zOrder: Array.isArray(snapshot.zOrder) ? snapshot.zOrder : [],
  };
}
