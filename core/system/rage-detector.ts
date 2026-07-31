/** Thresholds are deliberately high: normal browsing must never reach them. */
export const RAGE_LIMITS = {
  clickCount: 18,
  clickWindowMs: 2000,
  keyCount: 40,
  keyWindowMs: 2500,
} as const;

export function pruneOlderThan(
  stamps: readonly number[],
  now: number,
  windowMs: number,
): number[] {
  return stamps.filter((stamp) => now - stamp < windowMs);
}

export function isRage(clicks: number, keys: number): boolean {
  return clicks >= RAGE_LIMITS.clickCount || keys >= RAGE_LIMITS.keyCount;
}

/** Typing in a field is intent, not rage. */
export function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}
