import { addPose, type Pose } from "@/core/pet/animation/pose";

const BLINK_MIN_S = 2.4;
const BLINK_MAX_S = 6.5;
const BLINK_DURATION_S = 0.13;
const DOUBLE_BLINK_CHANCE = 0.22;
const BREATH_HZ = 0.55;
const HEAD_FOLLOW = 0.16;

export interface MicroState {
  blinkTimer: number;
  blinkPhase: number;
  blinksLeft: number;
  breath: number;
  headX: number;
  headY: number;
}

export function createMicro(): MicroState {
  return {
    blinkTimer: BLINK_MIN_S,
    blinkPhase: 0,
    blinksLeft: 0,
    breath: 0,
    headX: 0,
    headY: 0,
  };
}

export interface MicroInput {
  dt: number;
  /** -1..1 horizontal, -1..1 vertical offset of whatever PIX is looking at. */
  lookX: number;
  lookY: number;
  /** Blinking and head tracking stop while asleep. */
  awake: boolean;
  reducedMotion: boolean;
}

/**
 * Independent layers applied on top of the blended clip pose: eyes blink on
 * their own clock, the head tracks separately, and breathing never stops.
 */
export function applyMicro(
  pose: Pose,
  state: MicroState,
  input: MicroInput,
  random: () => number = Math.random,
): { pose: Pose; state: MicroState } {
  const next: MicroState = { ...state };

  next.breath = (next.breath + input.dt * BREATH_HZ) % 1;
  const breathScale = input.reducedMotion
    ? 1
    : 1 + Math.sin(next.breath * Math.PI * 2) * 0.022;

  let eyeOpen = 1;
  if (input.awake && !input.reducedMotion) {
    if (next.blinkPhase > 0) {
      next.blinkPhase = Math.max(0, next.blinkPhase - input.dt);
      const ratio = next.blinkPhase / BLINK_DURATION_S;
      eyeOpen = Math.abs(ratio - 0.5) * 2;
      if (next.blinkPhase === 0 && next.blinksLeft > 0) {
        next.blinksLeft -= 1;
        next.blinkPhase = BLINK_DURATION_S;
      }
    } else {
      next.blinkTimer -= input.dt;
      if (next.blinkTimer <= 0) {
        next.blinkPhase = BLINK_DURATION_S;
        next.blinksLeft = random() < DOUBLE_BLINK_CHANCE ? 1 : 0;
        next.blinkTimer = BLINK_MIN_S + random() * (BLINK_MAX_S - BLINK_MIN_S);
      }
    }
  }

  const targetX = input.awake ? input.lookX * 2.6 : 0;
  const targetY = input.awake ? input.lookY * 1.4 : 0;
  next.headX += (targetX - next.headX) * Math.min(1, input.dt * 6);
  next.headY += (targetY - next.headY) * Math.min(1, input.dt * 6);

  return {
    state: next,
    pose: addPose(pose, {
      bodySquash: breathScale,
      eyeOpen,
      eyeX: next.headX,
      eyeY: next.headY,
      headRot: next.headX * HEAD_FOLLOW * 10,
    }),
  };
}
