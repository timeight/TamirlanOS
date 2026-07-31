export interface HabitTable {
  /** Node id → affinity. Grows where PIX lingers, decays everywhere else. */
  places: Record<string, number>;
  /** App id → affinity, driven by what the visitor actually opens. */
  apps: Record<string, number>;
}

const PLACE_GAIN = 1;
const APP_GAIN = 1.4;
const MAX_AFFINITY = 12;
/** Applied on every visit so stale habits fade instead of locking in forever. */
const SESSION_DECAY = 0.85;

export function createHabits(): HabitTable {
  return { places: {}, apps: {} };
}

export function reinforcePlace(habits: HabitTable, nodeId: string): HabitTable {
  const current = habits.places[nodeId] ?? 0;
  return {
    ...habits,
    places: {
      ...habits.places,
      [nodeId]: Math.min(MAX_AFFINITY, current + PLACE_GAIN),
    },
  };
}

export function reinforceApp(habits: HabitTable, appId: string): HabitTable {
  const current = habits.apps[appId] ?? 0;
  return {
    ...habits,
    apps: {
      ...habits.apps,
      [appId]: Math.min(MAX_AFFINITY, current + APP_GAIN),
    },
  };
}

/** Called once per visit; habits weaken so PIX can pick up new ones. */
export function ageHabits(habits: HabitTable): HabitTable {
  const shrink = (table: Record<string, number>) =>
    Object.fromEntries(
      Object.entries(table)
        .map(([key, value]) => [key, value * SESSION_DECAY] as const)
        .filter(([, value]) => value > 0.3),
    );
  return { places: shrink(habits.places), apps: shrink(habits.apps) };
}

/** Multiplier applied to a navigation node's weight. */
export function placeBias(habits: HabitTable, nodeId: string): number {
  return 1 + (habits.places[nodeId] ?? 0) * 0.14;
}

export function favouritePlace(habits: HabitTable): string | null {
  const entries = Object.entries(habits.places);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function favouriteApp(habits: HabitTable): string | null {
  const entries = Object.entries(habits.apps);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
