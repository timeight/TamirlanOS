import { WorldEventType, type WorldEvent } from "@/core/events/world-events";
import { moodBias, type Mood } from "@/core/pet/pet-mood";
import { traitBias, type TraitWeights } from "@/core/pet/personality";
import { rollRareEvent, type RareEvent } from "@/core/pet/random-events";
import { energyFor, type DayPart } from "@/core/pet/reaction-engine";
import { canTransition, definitionOf } from "@/core/pet/pet-state-machine";
import { PetState, type PetVector } from "@/core/pet/pet-types";

const ACTIVE_STATES: readonly PetState[] = [
  PetState.Walk,
  PetState.Run,
  PetState.Jump,
  PetState.Dance,
  PetState.Celebrate,
];

export const THINK_MIN_MS = 500;
export const THINK_MAX_MS = 1000;
export const IDLE_SIT_S = 60;
export const IDLE_SLEEP_S = 120;
export const CURSOR_NEAR_PX = 130;
export const CURSOR_DWELL_S = 1.6;

export interface BrainContext {
  now: number;
  state: PetState;
  stateElapsed: number;
  stateDuration: number;
  mood: Mood;
  position: PetVector;
  cursor: PetVector;
  cursorDistance: number;
  cursorDwellSeconds: number;
  idleSeconds: number;
  focusedAppId: string | null;
  focusChanged: boolean;
  openWindowCount: number;
  friendship: number;
  events: readonly WorldEvent[];
  cooldowns: Readonly<Record<string, number>>;
  traits: TraitWeights;
  dayPart: DayPart;
}

export interface Decision {
  state: PetState;
  /** Set when the chosen state needs somewhere to go. */
  needsTarget: boolean;
  reason: string;
  /** Present when a rare event triggered the decision. */
  rare?: RareEvent;
}

/** Base weights before mood and context are applied. */
const BASE_WEIGHTS: Partial<Record<PetState, number>> = {
  [PetState.Walk]: 30,
  [PetState.Idle]: 18,
  [PetState.Observe]: 16,
  [PetState.Sit]: 12,
  [PetState.Think]: 10,
  [PetState.Wave]: 5,
  [PetState.Jump]: 4,
  [PetState.Dance]: 3,
  [PetState.Repair]: 3,
  [PetState.Confused]: 2,
};

function offCooldown(
  state: PetState,
  cooldowns: BrainContext["cooldowns"],
  now: number,
): boolean {
  const readyAt = cooldowns[state] ?? 0;
  return now >= readyAt;
}

function allowed(context: BrainContext, target: PetState): boolean {
  const current = definitionOf(context.state);
  const finished = context.stateElapsed >= context.stateDuration;
  if (!finished && !current.interruptible) return false;
  if (!finished && definitionOf(target).priority <= current.priority) {
    return false;
  }
  return canTransition(context.state, target);
}

function decide(state: PetState, reason: string): Decision {
  return {
    state,
    needsTarget: definitionOf(state).requiresTarget === true,
    reason,
  };
}

/**
 * Evaluates the whole desktop and returns exactly one action, or null when the
 * current state should keep running.
 */
export function think(
  context: BrainContext,
  random: () => number = Math.random,
): Decision | null {
  // 1. Reflexes — world events beat everything else.
  for (const event of context.events) {
    switch (event.type) {
      case WorldEventType.AchievementUnlocked:
      case WorldEventType.PuzzleSolved:
      case WorldEventType.UserReturned:
        if (allowed(context, PetState.Celebrate)) {
          return decide(PetState.Celebrate, "event:celebrate");
        }
        break;
      case WorldEventType.SecretFound:
        if (allowed(context, PetState.Jump)) {
          return decide(PetState.Jump, "event:secret");
        }
        break;
      case WorldEventType.SongStarted:
        if (allowed(context, PetState.Dance)) {
          return decide(PetState.Dance, "event:music");
        }
        break;
      case WorldEventType.SystemError:
      case WorldEventType.TimeMachine:
        if (allowed(context, PetState.Confused)) {
          return decide(PetState.Confused, "event:glitch");
        }
        break;
      // Not celebration: something was found that PIX was not guarding well.
      case WorldEventType.LostFiles:
        if (event.active && allowed(context, PetState.Observe)) {
          return decide(PetState.Observe, "event:lost-files");
        }
        break;
      default:
        break;
    }
  }

  // 2. Sleep cycle.
  if (context.state === PetState.Sleep) {
    return context.idleSeconds < 1 ? decide(PetState.Wake, "idle:wake") : null;
  }
  if (context.idleSeconds >= IDLE_SLEEP_S && allowed(context, PetState.Sleep)) {
    return decide(PetState.Sleep, "idle:sleep");
  }
  if (
    context.idleSeconds >= IDLE_SIT_S &&
    context.state !== PetState.Sit &&
    allowed(context, PetState.Sit)
  ) {
    return decide(PetState.Sit, "idle:sit");
  }

  // 3. Attention — a fresh window or a lingering cursor.
  if (context.focusChanged && allowed(context, PetState.Walk)) {
    return decide(PetState.Walk, "focus:approach");
  }
  if (
    context.cursorDistance < CURSOR_NEAR_PX &&
    context.cursorDwellSeconds > CURSOR_DWELL_S &&
    context.state !== PetState.Observe &&
    allowed(context, PetState.Observe)
  ) {
    return decide(PetState.Observe, "cursor:dwell");
  }

  // 4. Nothing urgent: let the current state finish.
  if (context.stateElapsed < context.stateDuration) return null;

  // 4b. A rare surprise, rolled only once the previous action has finished.
  const rare = rollRareEvent(context.friendship, random);
  if (rare && canTransition(context.state, rare.state)) {
    return { state: rare.state, needsTarget: false, reason: "rare", rare };
  }

  // 5. Ambient choice, weighted by mood and gated by cooldowns.
  const candidates = (Object.keys(BASE_WEIGHTS) as PetState[]).filter(
    (state) =>
      state !== context.state &&
      offCooldown(state, context.cooldowns, context.now) &&
      canTransition(context.state, state),
  );
  if (!candidates.length) return decide(PetState.Idle, "fallback:idle");

  const energy = energyFor(context.dayPart);
  const weights = candidates.map((state) => {
    const base = BASE_WEIGHTS[state] ?? 1;
    const social = state === PetState.Wave ? 1 + context.friendship / 80 : 1;
    const clock = ACTIVE_STATES.includes(state) ? energy : 2 - energy;
    return Math.max(
      0.05,
      base *
        moodBias(context.mood, state) *
        traitBias(context.traits, state) *
        social *
        clock,
    );
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = random() * total;
  for (let index = 0; index < candidates.length; index++) {
    roll -= weights[index] ?? 0;
    if (roll <= 0) return decide(candidates[index]!, "ambient");
  }
  return decide(candidates[0]!, "ambient");
}

export function nextThinkDelay(random: () => number = Math.random): number {
  return THINK_MIN_MS + random() * (THINK_MAX_MS - THINK_MIN_MS);
}
