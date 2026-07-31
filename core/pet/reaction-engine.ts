import { WorldEventType, type WorldEvent } from "@/core/events/world-events";
import type { Emotion } from "@/core/pet/emotion-engine";
import { PetState } from "@/core/pet/pet-types";

export type Interaction =
  | "click"
  | "double-click"
  | "drag-start"
  | "drag-end"
  | "window-opened"
  | "window-closed"
  | "long-idle"
  | "returned";

export interface Reaction {
  state: PetState;
  duration: number;
  emotion: { kind: Emotion; amount: number };
  /** Friendship awarded by the interaction. */
  friendship?: number;
}

/** Direct interactions map to an immediate, predictable response. */
export const INTERACTIONS: Record<Interaction, Reaction> = {
  click: {
    state: PetState.Wave,
    duration: 1.6,
    emotion: { kind: "happy", amount: 35 },
    friendship: 1,
  },
  "double-click": {
    state: PetState.Jump,
    duration: 1.2,
    emotion: { kind: "excited", amount: 55 },
    friendship: 2,
  },
  "drag-start": {
    state: PetState.Dizzy,
    duration: 2.6,
    emotion: { kind: "scared", amount: 50 },
  },
  "drag-end": {
    state: PetState.Wave,
    duration: 1.4,
    emotion: { kind: "happy", amount: 45 },
    friendship: 1,
  },
  "window-opened": {
    state: PetState.Observe,
    duration: 3.2,
    emotion: { kind: "curious", amount: 55 },
  },
  "window-closed": {
    state: PetState.Idle,
    duration: 1.6,
    emotion: { kind: "calm", amount: 25 },
  },
  "long-idle": {
    state: PetState.Sleep,
    duration: 30,
    emotion: { kind: "sleepy", amount: 80 },
  },
  returned: {
    state: PetState.Celebrate,
    duration: 2.6,
    emotion: { kind: "excited", amount: 70 },
    friendship: 3,
  },
};

/** Emotional colouring for world events. */
export function emotionForEvent(
  event: WorldEvent,
): { kind: Emotion; amount: number } | null {
  switch (event.type) {
    case WorldEventType.AchievementUnlocked:
    case WorldEventType.PuzzleSolved:
      return { kind: "proud", amount: 75 };
    case WorldEventType.SecretFound:
      return { kind: "excited", amount: 80 };
    case WorldEventType.SystemError:
    case WorldEventType.LostFiles:
      return { kind: "scared", amount: 60 };
    case WorldEventType.TimeMachine:
      return { kind: "confused", amount: 70 };
    case WorldEventType.SongStarted:
      return { kind: "excited", amount: 65 };
    case WorldEventType.WeatherChanged:
      return { kind: "curious", amount: 45 };
    case WorldEventType.WindowOpened:
    case WorldEventType.WindowFocused:
      return { kind: "curious", amount: 40 };
    case WorldEventType.UserReturned:
      return { kind: "excited", amount: 70 };
    default:
      return null;
  }
}

export type DayPart = "morning" | "day" | "evening" | "night";

export function dayPartOf(date: Date): DayPart {
  const hour = date.getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "day";
  if (hour < 23) return "evening";
  return "night";
}

/** Energy multiplier applied to active states; PIX is livelier in the morning. */
export function energyFor(part: DayPart): number {
  switch (part) {
    case "morning":
      return 1.25;
    case "day":
      return 1.1;
    case "evening":
      return 0.9;
    case "night":
      return 0.65;
  }
}
