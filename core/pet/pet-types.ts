export enum PetState {
  Idle = "idle",
  Walk = "walk",
  Run = "run",
  LookAround = "look-around",
  Observe = "observe",
  Wave = "wave",
  Think = "think",
  Jump = "jump",
  Sleep = "sleep",
  Wake = "wake",
  Dance = "dance",
  Repair = "repair",
  Celebrate = "celebrate",
  Confused = "confused",
  Peek = "peek",
  Sit = "sit",
  Inspect = "inspect",
  FollowCursor = "follow-cursor",
  ObserveWindow = "observe-window",
  Hide = "hide",
  Dizzy = "dizzy",
}

export type PetMood =
  "happy" | "curious" | "sleepy" | "excited" | "scared" | "proud" | "idle";

export interface PetVector {
  x: number;
  y: number;
}

export interface PetBounds {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Everything the renderer needs for one frame. */
export interface PetFrame {
  position: PetVector;
  facing: 1 | -1;
  state: PetState;
  mood: PetMood;
  /** 0..1 progress through the current state, drives per-state animation. */
  progress: number;
  /** Seconds since the state started. */
  elapsed: number;
  /** Degrees of body tilt from steering; drives the walk lean. */
  lean: number;
  /** Current speed in px/s, used by the sprite to pace the gait. */
  speed: number;
}

export const PET_SIZE = { width: 64, height: 80 } as const;
export const TASKBAR_HEIGHT = 30;
