import { PetState } from "@/core/pet/pet-types";

export type Mood =
  "happy" | "curious" | "sleepy" | "excited" | "scared" | "proud" | "idle";

/** Multipliers applied to a state's base weight for the current mood. */
const MOOD_BIAS: Record<Mood, Partial<Record<PetState, number>>> = {
  happy: {
    [PetState.Walk]: 1.2,
    [PetState.Wave]: 1.6,
    [PetState.Dance]: 1.5,
    [PetState.Jump]: 1.4,
    [PetState.Sit]: 0.7,
  },
  curious: {
    [PetState.Observe]: 2.2,
    [PetState.Think]: 1.6,
    [PetState.Walk]: 1.3,
    [PetState.Sit]: 0.6,
    [PetState.Dance]: 0.4,
  },
  sleepy: {
    [PetState.Sit]: 2.4,
    [PetState.Idle]: 1.8,
    [PetState.Walk]: 0.4,
    [PetState.Dance]: 0.1,
    [PetState.Jump]: 0.1,
  },
  excited: {
    [PetState.Jump]: 2.2,
    [PetState.Dance]: 2,
    [PetState.Celebrate]: 1.8,
    [PetState.Walk]: 1.4,
    [PetState.Idle]: 0.5,
  },
  scared: {
    [PetState.Confused]: 2.4,
    [PetState.Idle]: 1.6,
    [PetState.Sit]: 1.2,
    [PetState.Dance]: 0.1,
    [PetState.Wave]: 0.3,
  },
  proud: {
    [PetState.Celebrate]: 2.2,
    [PetState.Wave]: 1.6,
    [PetState.Repair]: 1.4,
    [PetState.Sit]: 0.6,
  },
  idle: {},
};

export function moodBias(mood: Mood, state: PetState): number {
  return MOOD_BIAS[mood][state] ?? 1;
}

export interface MoodInputs {
  idleSeconds: number;
  friendship: number;
  cursorNear: boolean;
  windowJustOpened: boolean;
  recentAchievement: boolean;
  dizzy: boolean;
}

/** Moods are derived, never set by hand, so behaviour stays explainable. */
export function deriveMood(inputs: MoodInputs): Mood {
  if (inputs.dizzy) return "scared";
  if (inputs.idleSeconds > 120) return "sleepy";
  if (inputs.recentAchievement) return "proud";
  if (inputs.windowJustOpened) return "curious";
  if (inputs.cursorNear) return "curious";
  if (inputs.idleSeconds > 60) return "idle";
  if (inputs.friendship >= 60) return "excited";
  return "happy";
}
