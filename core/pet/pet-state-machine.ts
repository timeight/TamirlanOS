import { PetState } from "@/core/pet/pet-types";

export interface StateDefinition {
  id: PetState;
  /** Seconds, picked uniformly inside the range when the state is entered. */
  duration: readonly [number, number];
  /** Higher priority may interrupt a lower one. */
  priority: number;
  /** Lower-priority requests cannot cut in while this is false. */
  interruptible: boolean;
  /** Minimum gap before the brain may pick this state again. */
  cooldownMs: number;
  /** States reachable from here. Anything else is rejected. */
  transitions: readonly PetState[];
  /** The state needs a navigation target before it can start. */
  requiresTarget?: boolean;
}

const ANY_AMBIENT: readonly PetState[] = [
  PetState.Idle,
  PetState.Walk,
  PetState.Sit,
  PetState.Think,
  PetState.Observe,
  PetState.Wave,
  PetState.Jump,
  PetState.Dance,
  PetState.Repair,
  PetState.Celebrate,
  PetState.Confused,
  PetState.Sleep,
];

function define(
  id: PetState,
  duration: readonly [number, number],
  priority: number,
  cooldownMs: number,
  transitions: readonly PetState[],
  options: { interruptible?: boolean; requiresTarget?: boolean } = {},
): StateDefinition {
  return {
    id,
    duration,
    priority,
    cooldownMs,
    transitions,
    interruptible: options.interruptible ?? true,
    requiresTarget: options.requiresTarget ?? false,
  };
}

export const STATE_MACHINE: Readonly<Record<PetState, StateDefinition>> = {
  [PetState.Idle]: define(PetState.Idle, [2, 4], 10, 0, ANY_AMBIENT),
  [PetState.Walk]: define(
    PetState.Walk,
    [3, 7],
    20,
    2000,
    [PetState.Idle, PetState.Observe, PetState.Sit, PetState.Think],
    { requiresTarget: true },
  ),
  [PetState.Sit]: define(PetState.Sit, [4, 9], 25, 8000, [
    PetState.Idle,
    PetState.Sleep,
    PetState.Walk,
    PetState.Observe,
  ]),
  [PetState.Sleep]: define(PetState.Sleep, [30, 30], 80, 0, [PetState.Wake], {
    interruptible: false,
  }),
  [PetState.Wake]: define(
    PetState.Wake,
    [1.6, 1.6],
    85,
    0,
    [PetState.Idle, PetState.Walk],
    { interruptible: false },
  ),
  [PetState.Think]: define(PetState.Think, [2.5, 4], 30, 12000, [
    PetState.Idle,
    PetState.Walk,
    PetState.Observe,
  ]),
  [PetState.Observe]: define(PetState.Observe, [2, 5], 40, 4000, [
    PetState.Idle,
    PetState.Walk,
    PetState.Think,
    PetState.Sit,
  ]),
  [PetState.Wave]: define(
    PetState.Wave,
    [1.6, 1.6],
    70,
    3000,
    [PetState.Idle, PetState.Walk],
    { interruptible: false },
  ),
  [PetState.Jump]: define(
    PetState.Jump,
    [1.1, 1.1],
    70,
    3000,
    [PetState.Idle, PetState.Walk, PetState.Celebrate],
    { interruptible: false },
  ),
  [PetState.Dance]: define(PetState.Dance, [3, 5], 35, 25000, [
    PetState.Idle,
    PetState.Walk,
  ]),
  [PetState.Repair]: define(PetState.Repair, [3, 5], 35, 30000, [
    PetState.Idle,
    PetState.Walk,
  ]),
  [PetState.Celebrate]: define(
    PetState.Celebrate,
    [2.4, 3.4],
    75,
    10000,
    [PetState.Idle, PetState.Jump, PetState.Walk],
    { interruptible: false },
  ),
  [PetState.Confused]: define(PetState.Confused, [2, 3.5], 45, 15000, [
    PetState.Idle,
    PetState.Walk,
    PetState.Think,
  ]),
  [PetState.Hide]: define(PetState.Hide, [999, 999], 5, 0, [PetState.Peek], {
    interruptible: false,
  }),
  [PetState.Peek]: define(
    PetState.Peek,
    [2.2, 2.2],
    90,
    0,
    [PetState.Walk, PetState.Idle],
    { interruptible: false },
  ),
  [PetState.Dizzy]: define(
    PetState.Dizzy,
    [2.6, 2.6],
    95,
    0,
    [PetState.Idle, PetState.Wave],
    { interruptible: false },
  ),
  // Legacy aliases kept so older callers and saved states stay valid.
  [PetState.Run]: define(PetState.Run, [2, 4], 22, 4000, ANY_AMBIENT, {
    requiresTarget: true,
  }),
  [PetState.LookAround]: define(
    PetState.LookAround,
    [2, 3],
    38,
    4000,
    ANY_AMBIENT,
  ),
  [PetState.FollowCursor]: define(
    PetState.FollowCursor,
    [2, 4],
    50,
    3000,
    ANY_AMBIENT,
  ),
  [PetState.ObserveWindow]: define(
    PetState.ObserveWindow,
    [3, 5],
    45,
    6000,
    ANY_AMBIENT,
  ),
  [PetState.Inspect]: define(PetState.Inspect, [3, 4], 40, 8000, ANY_AMBIENT),
};

export function definitionOf(state: PetState): StateDefinition {
  return STATE_MACHINE[state];
}

export function canTransition(from: PetState, to: PetState): boolean {
  if (from === to) return false;
  const definition = STATE_MACHINE[from];
  if (definition.transitions.includes(to)) return true;
  // A strictly higher priority may always cut in, provided the source allows it.
  return (
    definition.interruptible && STATE_MACHINE[to].priority > definition.priority
  );
}

export function rollDuration(
  state: PetState,
  random: () => number = Math.random,
): number {
  const [min, max] = STATE_MACHINE[state].duration;
  return min + random() * (max - min);
}
