import type { Emotion } from "@/core/pet/emotion-engine";
import { PetState } from "@/core/pet/pet-types";

export interface RareEvent {
  id: string;
  state: PetState;
  duration: number;
  /** Translation key, shown only when PIX is allowed to speak. */
  lineKey?: string;
  emotion?: { kind: Emotion; amount: number };
  /** Relative chance inside the pool. */
  weight: number;
  /** Minimum friendship before the event can occur. */
  minFriendship?: number;
}

/**
 * Deliberately rare. The roll happens once per decision tick and almost always
 * fails, so these read as surprises rather than a rotation.
 */
export const RARE_EVENT_CHANCE = 0.012;

export const RARE_EVENTS: readonly RareEvent[] = [
  {
    id: "coin",
    state: PetState.Celebrate,
    duration: 2.6,
    lineKey: "pix.rare.coin",
    emotion: { kind: "proud", amount: 45 },
    weight: 8,
  },
  {
    id: "sneeze",
    state: PetState.Confused,
    duration: 1.8,
    lineKey: "pix.rare.sneeze",
    emotion: { kind: "embarrassed", amount: 40 },
    weight: 10,
  },
  {
    id: "trip",
    state: PetState.Dizzy,
    duration: 2.2,
    lineKey: "pix.rare.trip",
    emotion: { kind: "embarrassed", amount: 60 },
    weight: 7,
  },
  {
    id: "drop-screwdriver",
    state: PetState.Repair,
    duration: 3,
    lineKey: "pix.rare.screwdriver",
    emotion: { kind: "confused", amount: 35 },
    weight: 7,
  },
  {
    id: "watch-clock",
    state: PetState.Observe,
    duration: 3.4,
    lineKey: "pix.rare.clock",
    emotion: { kind: "thinking", amount: 40 },
    weight: 9,
  },
  {
    id: "admire-wallpaper",
    state: PetState.Observe,
    duration: 3.6,
    lineKey: "pix.rare.wallpaper",
    emotion: { kind: "calm", amount: 50 },
    weight: 9,
  },
  {
    id: "inspect-bin",
    state: PetState.Inspect,
    duration: 3.2,
    lineKey: "pix.rare.bin",
    emotion: { kind: "curious", amount: 45 },
    weight: 8,
  },
  {
    id: "pretend-repair",
    state: PetState.Repair,
    duration: 4,
    lineKey: "pix.rare.fixing",
    emotion: { kind: "proud", amount: 30 },
    weight: 6,
  },
  {
    id: "secret-whisper",
    state: PetState.Think,
    duration: 3.4,
    lineKey: "pix.rare.secret",
    emotion: { kind: "excited", amount: 55 },
    weight: 5,
    minFriendship: 75,
  },
];

export function rollRareEvent(
  friendship: number,
  random: () => number = Math.random,
): RareEvent | null {
  if (random() > RARE_EVENT_CHANCE) return null;
  const pool = RARE_EVENTS.filter(
    (event) => friendship >= (event.minFriendship ?? 0),
  );
  const total = pool.reduce((sum, event) => sum + event.weight, 0);
  let roll = random() * total;
  for (const event of pool) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return null;
}
