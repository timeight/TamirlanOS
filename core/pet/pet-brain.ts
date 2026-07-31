import { PetState } from "@/core/pet/pet-types";

export interface BehaviourOption {
  state: PetState;
  weight: number;
  /** Seconds the state lasts. */
  duration: number;
}

/** Ambient behaviour pool. Weights favour calm actions so PIX never feels manic. */
const AMBIENT: readonly BehaviourOption[] = [
  { state: PetState.Walk, weight: 26, duration: 3.2 },
  { state: PetState.LookAround, weight: 18, duration: 2.4 },
  { state: PetState.Idle, weight: 16, duration: 2.8 },
  { state: PetState.Sit, weight: 12, duration: 4 },
  { state: PetState.Think, weight: 9, duration: 2.6 },
  { state: PetState.Inspect, weight: 7, duration: 3 },
  { state: PetState.Wave, weight: 5, duration: 1.6 },
  { state: PetState.Jump, weight: 4, duration: 1.1 },
  { state: PetState.Dance, weight: 3, duration: 3.4 },
];

export const AMBIENT_MIN_MS = 8000;
export const AMBIENT_MAX_MS = 20000;

/** Weighted pick that never returns the previous state twice in a row. */
export function pickBehaviour(
  previous: PetState | null,
  random: () => number = Math.random,
): BehaviourOption {
  const pool = AMBIENT.filter((option) => option.state !== previous);
  const total = pool.reduce((sum, option) => sum + option.weight, 0);
  let roll = random() * total;
  for (const option of pool) {
    roll -= option.weight;
    if (roll <= 0) return option;
  }
  return pool[0] ?? AMBIENT[0]!;
}

export function nextAmbientDelay(random: () => number = Math.random): number {
  return AMBIENT_MIN_MS + random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS);
}

/** Idle thresholds, in seconds without any user input. */
export const IDLE_SIT_S = 60;
export const IDLE_SLEEP_S = 120;

export function idleStateFor(idleSeconds: number): PetState | null {
  if (idleSeconds >= IDLE_SLEEP_S) return PetState.Sleep;
  if (idleSeconds >= IDLE_SIT_S) return PetState.Sit;
  return null;
}
