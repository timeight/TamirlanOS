import {
  clipFor,
  DEFAULT_PACK,
  type AnimationClip,
  type AnimationPack,
  type ClipContext,
} from "@/core/pet/animation/clips";
import {
  blendPose,
  easeInOut,
  REST_POSE,
  type Pose,
} from "@/core/pet/animation/pose";
import type { PetState } from "@/core/pet/pet-types";

interface Track {
  clip: AnimationClip;
  state: PetState;
  time: number;
  variation: number;
}

export interface AnimatorInput {
  dt: number;
  speed: number;
}

/**
 * Holds two tracks at once and cross-fades between them, so a state change is
 * always a transition and never a cut.
 */
export class PetAnimator {
  private pack: AnimationPack;
  private current: Track | null = null;
  private previous: Track | null = null;
  private previousPose: Pose = REST_POSE;
  private blend = 1;
  private blendDuration = 0.25;
  private lastPose: Pose = REST_POSE;
  private idleVariationAt = 0;

  constructor(pack: AnimationPack = DEFAULT_PACK) {
    this.pack = pack;
  }

  /** Swapping packs mid-run keeps the pose, so skins can hot-swap animations. */
  setPack(pack: AnimationPack): void {
    this.pack = pack;
    if (this.current) {
      this.current = {
        ...this.current,
        clip: clipFor(pack, this.current.state),
      };
    }
  }

  play(state: PetState, random: () => number = Math.random): void {
    if (this.current?.state === state) return;
    const clip = clipFor(this.pack, state);
    if (this.current) {
      this.previous = this.current;
      this.previousPose = this.lastPose;
      this.blendDuration = Math.max(
        0.08,
        (this.current.clip.blendOut + clip.blendIn) / 2,
      );
      this.blend = 0;
    } else {
      this.blend = 1;
    }
    this.current = {
      clip,
      state,
      time: 0,
      variation: Math.floor(random() * 4),
    };
    this.idleVariationAt = 0;
  }

  update(
    { dt, speed }: AnimatorInput,
    random: () => number = Math.random,
  ): Pose {
    if (!this.current) return REST_POSE;

    this.current.time += dt;
    if (this.previous) this.previous.time += dt;

    // Looping idle clips reroll their flavour so repeats never look identical.
    if (this.current.clip.loop && this.current.clip.id === "idle") {
      this.idleVariationAt += dt;
      if (this.idleVariationAt > 3.5) {
        this.idleVariationAt = 0;
        this.current.variation = Math.floor(random() * 4);
        this.current.time = 0;
      }
    }

    const context: ClipContext = {
      time: this.current.time,
      entry: Math.min(1, this.current.time / this.current.clip.blendIn),
      exit: 0,
      speed,
      variation: this.current.variation,
    };
    const target = this.current.clip.sample(context);

    if (this.blend < 1) {
      this.blend = Math.min(1, this.blend + dt / this.blendDuration);
      const source = this.previous
        ? this.previous.clip.sample({
            time: this.previous.time,
            entry: 1,
            exit: this.blend,
            speed,
            variation: this.previous.variation,
          })
        : this.previousPose;
      this.lastPose = blendPose(source, target, easeInOut(this.blend));
      if (this.blend >= 1) this.previous = null;
      return this.lastPose;
    }

    this.lastPose = target;
    return target;
  }

  get state(): PetState | null {
    return this.current?.state ?? null;
  }
}
