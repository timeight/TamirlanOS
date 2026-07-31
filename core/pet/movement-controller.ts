import type { PetVector } from "@/core/pet/pet-types";

export const WALK_SPEED = 52;
export const RUN_SPEED = 128;
const ACCELERATION = 210;
const DECELERATION = 300;
/** Radians per second; keeps turns from snapping. */
const TURN_RATE = 7.5;
const ARRIVE_RADIUS = 6;
const SLOW_RADIUS = 46;
const MAX_LEAN_DEG = 7;

export interface MotionState {
  velocity: PetVector;
  heading: number;
  speed: number;
  lean: number;
}

export function createMotion(): MotionState {
  return { velocity: { x: 0, y: 0 }, heading: 0, speed: 0, lean: 0 };
}

export interface MotionResult {
  position: PetVector;
  motion: MotionState;
  facing: 1 | -1;
  arrived: boolean;
}

function shortestAngle(from: number, to: number): number {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

/**
 * Steers toward a waypoint with acceleration, arrival damping and a capped turn
 * rate, so PIX eases in and out instead of sliding at constant speed.
 */
export function advance(
  position: PetVector,
  motion: MotionState,
  waypoint: PetVector | null,
  dt: number,
  running = false,
): MotionResult {
  const state: MotionState = {
    velocity: { ...motion.velocity },
    heading: motion.heading,
    speed: motion.speed,
    lean: motion.lean,
  };

  if (!waypoint) {
    state.speed = Math.max(0, state.speed - DECELERATION * dt);
    state.lean += (0 - state.lean) * Math.min(1, dt * 8);
    const glide = {
      x: position.x + Math.cos(state.heading) * state.speed * dt,
      y: position.y + Math.sin(state.heading) * state.speed * dt,
    };
    return {
      position: state.speed > 1 ? glide : position,
      motion: state,
      facing: Math.cos(state.heading) >= 0 ? 1 : -1,
      arrived: true,
    };
  }

  const dx = waypoint.x - position.x;
  const dy = waypoint.y - position.y;
  const distance = Math.hypot(dx, dy);

  if (distance < ARRIVE_RADIUS) {
    state.speed = Math.max(0, state.speed - DECELERATION * dt);
    state.lean += (0 - state.lean) * Math.min(1, dt * 8);
    return {
      position,
      motion: state,
      facing: Math.cos(state.heading) >= 0 ? 1 : -1,
      arrived: true,
    };
  }

  const desiredHeading = Math.atan2(dy, dx);
  const turn = shortestAngle(state.heading, desiredHeading);
  const maxTurn = TURN_RATE * dt;
  const appliedTurn = Math.max(-maxTurn, Math.min(maxTurn, turn));
  state.heading += appliedTurn;

  // Slow into the waypoint and while turning sharply.
  const topSpeed = running ? RUN_SPEED : WALK_SPEED;
  const arrivalFactor = Math.min(1, distance / SLOW_RADIUS);
  const turnFactor = 1 - Math.min(0.65, Math.abs(turn) / Math.PI);
  const targetSpeed = topSpeed * arrivalFactor * turnFactor;

  state.speed +=
    (targetSpeed > state.speed ? ACCELERATION : -DECELERATION) * dt;
  state.speed = Math.max(0, Math.min(topSpeed, state.speed));

  const leanTarget =
    (appliedTurn / Math.max(maxTurn, 0.0001)) *
    MAX_LEAN_DEG *
    (state.speed / topSpeed);
  state.lean += (leanTarget - state.lean) * Math.min(1, dt * 9);

  const travel = Math.min(distance, state.speed * dt);
  return {
    position: {
      x: position.x + Math.cos(state.heading) * travel,
      y: position.y + Math.sin(state.heading) * travel,
    },
    motion: state,
    facing: Math.cos(state.heading) >= 0 ? 1 : -1,
    arrived: false,
  };
}
