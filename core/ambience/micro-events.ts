export enum MicroEvent {
  Cloud = "cloud",
  Breeze = "breeze",
  Sparkle = "sparkle",
  LightShift = "light-shift",
}

interface MicroEventDef {
  id: MicroEvent;
  weight: number;
  durationMs: number;
  /** Minimum wait before this one may happen again. */
  cooldownMs: number;
}

const CATALOG: readonly MicroEventDef[] = [
  { id: MicroEvent.Cloud, weight: 34, durationMs: 26_000, cooldownMs: 240_000 },
  { id: MicroEvent.Breeze, weight: 26, durationMs: 5_200, cooldownMs: 180_000 },
  {
    id: MicroEvent.Sparkle,
    weight: 18,
    durationMs: 2_400,
    cooldownMs: 300_000,
  },
  {
    id: MicroEvent.LightShift,
    weight: 22,
    durationMs: 14_000,
    cooldownMs: 420_000,
  },
];

/** Checked once a minute; low odds are what keeps these from becoming décor. */
export const MICRO_EVENT_CHANCE = 0.16;

export function durationOf(event: MicroEvent): number {
  return CATALOG.find((item) => item.id === event)?.durationMs ?? 5_000;
}

/**
 * Picks a micro event that is off cooldown, or null. `lastFiredAt` maps an
 * event to the timestamp it last ran; unseen events are always eligible.
 */
export function rollMicroEvent(
  lastFiredAt: Partial<Record<MicroEvent, number>>,
  now: number,
  random: () => number = Math.random,
): MicroEvent | null {
  if (random() > MICRO_EVENT_CHANCE) return null;

  const ready = CATALOG.filter((item) => {
    const last = lastFiredAt[item.id];
    return last === undefined || now - last >= item.cooldownMs;
  });
  if (ready.length === 0) return null;

  const total = ready.reduce((sum, item) => sum + item.weight, 0);
  let ticket = random() * total;
  for (const item of ready) {
    ticket -= item.weight;
    if (ticket <= 0) return item.id;
  }
  return ready[ready.length - 1]?.id ?? null;
}
