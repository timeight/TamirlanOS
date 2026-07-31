import { REST_POSE, type Pose } from "@/core/pet/animation/pose";
import { PetState } from "@/core/pet/pet-types";

export interface ClipContext {
  /** Seconds since the clip started. */
  time: number;
  /** 0..1 across entry, used to ease a clip in. */
  entry: number;
  /** 0..1 across exit; 1 means fully leaving. */
  exit: number;
  /** Movement speed in px/s, drives gait timing. */
  speed: number;
  /** Randomised on entry so repeats never look identical. */
  variation: number;
}

export interface AnimationClip {
  id: string;
  /** Cross-fade durations in seconds. */
  blendIn: number;
  blendOut: number;
  /** Idle-style clips loop; one-shots hold their last frame until replaced. */
  loop: boolean;
  sample: (context: ClipContext) => Pose;
}

export interface AnimationPack {
  id: string;
  clips: Readonly<Record<PetState, AnimationClip>>;
}

const pose = (overrides: Partial<Pose>): Pose => ({
  ...REST_POSE,
  ...overrides,
});
const wave = (t: number, hz: number) => Math.sin(t * hz);

function clip(
  id: string,
  blendIn: number,
  blendOut: number,
  loop: boolean,
  sample: (context: ClipContext) => Pose,
): AnimationClip {
  return { id, blendIn, blendOut, loop, sample };
}

/** Four idle flavours; the variation index picks one on entry. */
function idleSample({ time, variation }: ClipContext): Pose {
  const flavour = variation % 4;
  if (flavour === 1) {
    // Stretch: arms up, body extends, then settles.
    const k = Math.min(1, time / 1.1);
    const pull = Math.sin(k * Math.PI);
    return pose({
      armL: -120 * pull,
      armR: -120 * pull,
      bodySquash: 1 + 0.08 * pull,
      headRot: -6 * pull,
      eyeOpen: 1 - 0.7 * pull,
      mouth: pull > 0.4 ? "open" : "smile",
    });
  }
  if (flavour === 2) {
    // Yawn: head back, mouth open, eyes shut.
    const k = Math.min(1, time / 1.4);
    const pull = Math.sin(k * Math.PI);
    return pose({
      headRot: -10 * pull,
      headY: -1.5 * pull,
      eyeOpen: 1 - 0.9 * pull,
      mouth: pull > 0.3 ? "open" : "smile",
      antennaRot: -8 * pull,
    });
  }
  if (flavour === 3) {
    // Scratch head.
    const k = Math.min(1, time / 1.3);
    const pull = Math.sin(k * Math.PI);
    return pose({
      armR: -95 * pull + wave(time, 14) * 6 * pull,
      headRot: 5 * pull,
      mouth: "small",
    });
  }
  return pose({ bodyY: wave(time, 1.6) * 0.7 });
}

const CLIPS: Record<PetState, AnimationClip> = {
  [PetState.Idle]: clip("idle", 0.28, 0.24, true, idleSample),

  [PetState.Walk]: clip("walk", 0.22, 0.2, true, ({ time, speed }) => {
    const gait = Math.max(0.4, Math.min(1.6, speed / 52));
    const stride = time * 9 * gait;
    return pose({
      bodyY: wave(stride, 1) * 2 * gait,
      legSwing: wave(stride, 1) * 9 * gait,
      armL: wave(stride, 1) * -11 * gait,
      armR: wave(stride, 1) * 11 * gait,
      antennaRot: wave(stride, 1) * -4 * gait,
    });
  }),

  [PetState.Run]: clip("run", 0.18, 0.18, true, ({ time, speed }) => {
    const gait = Math.max(0.8, Math.min(2.2, speed / 52));
    const stride = time * 11 * gait;
    return pose({
      bodyY: wave(stride, 1) * 3 * gait,
      bodyRot: 5,
      legSwing: wave(stride, 1) * 14 * gait,
      armL: wave(stride, 1) * -20 * gait,
      armR: wave(stride, 1) * 20 * gait,
      mouth: "open",
    });
  }),

  [PetState.Jump]: clip("jump", 0.14, 0.22, false, ({ time }) => {
    const k = Math.min(1, time / 1.1);
    const lift = Math.sin(k * Math.PI);
    return pose({
      bodyY: -18 * lift,
      bodySquash: k < 0.15 ? 0.88 : 1 + 0.06 * lift,
      legSwing: 12 * lift,
      armL: -50 * lift,
      armR: -50 * lift,
      mouth: "open",
      antennaY: -3 * lift,
    });
  }),

  [PetState.Wave]: clip("wave", 0.18, 0.26, false, ({ time }) => {
    const settle = Math.min(1, time / 0.25);
    return pose({
      armR: (-30 + wave(time, 12) * 34) * settle,
      headRot: 4 * settle,
      bodyY: wave(time, 6) * 0.6,
      mouth: "smile",
    });
  }),

  [PetState.Sit]: clip("sit", 0.34, 0.3, true, ({ time }) =>
    pose({
      sit: 1,
      bodyY: 6 + wave(time, 1.2) * 0.5,
      legSwing: 0,
      armL: 10,
      armR: 10,
      headRot: wave(time, 0.6) * 3,
    }),
  ),

  [PetState.Sleep]: clip("sleep", 0.5, 0.45, true, ({ time }) =>
    pose({
      sit: 1,
      bodyY: 7,
      bodySquash: 1 + Math.sin(time * 1.1) * 0.035,
      headRot: 12,
      headY: 2,
      eyeOpen: 0,
      mouth: "small",
      antennaRot: 14,
      zzz: 1,
    }),
  ),

  [PetState.Wake]: clip("wake", 0.4, 0.3, false, ({ time }) => {
    const k = Math.min(1, time / 1.6);
    const pull = Math.sin(k * Math.PI);
    return pose({
      sit: 1 - k,
      bodyY: 6 * (1 - k),
      armL: -70 * pull,
      armR: -70 * pull,
      headRot: -6 * pull,
      eyeOpen: k,
      mouth: pull > 0.4 ? "open" : "smile",
    });
  }),

  [PetState.Think]: clip("think", 0.3, 0.26, true, ({ time }) =>
    pose({
      armR: -88 + wave(time, 1.4) * 4,
      headRot: -5,
      eyeY: -1.2,
      mouth: "flat",
      antennaRot: wave(time, 2.2) * 6,
      bodyY: wave(time, 1.1) * 0.5,
    }),
  ),

  [PetState.Observe]: clip("observe", 0.3, 0.26, true, ({ time }) =>
    pose({
      headRot: wave(time, 1.1) * 9,
      eyeX: wave(time, 1.1) * 2.6,
      bodyY: wave(time, 1.3) * 0.6,
      mouth: "small",
    }),
  ),

  [PetState.LookAround]: clip("look-around", 0.3, 0.26, true, ({ time }) =>
    pose({
      headRot: wave(time, 0.9) * 12,
      eyeX: wave(time, 0.9) * 3,
      bodyY: wave(time, 1.2) * 0.6,
    }),
  ),

  [PetState.Dance]: clip("dance", 0.26, 0.28, true, ({ time }) => {
    const beat = time * 7;
    return pose({
      bodyY: -Math.abs(wave(beat, 1)) * 6,
      bodyRot: wave(beat, 0.5) * 9,
      armL: wave(beat, 1) * 40,
      armR: wave(beat, 1) * -40,
      legSwing: wave(beat, 0.5) * 10,
      antennaRot: wave(beat, 1) * 16,
      mouth: "open",
    });
  }),

  [PetState.Repair]: clip("repair", 0.3, 0.28, true, ({ time }) =>
    pose({
      armR: -60 + wave(time, 16) * 22,
      armL: -20,
      headRot: 8,
      eyeY: 1.4,
      mouth: "flat",
      bodyY: wave(time, 8) * 0.6,
    }),
  ),

  [PetState.Celebrate]: clip("celebrate", 0.2, 0.3, false, ({ time }) => {
    const hop = -Math.abs(wave(time * 6, 1)) * 10;
    return pose({
      bodyY: hop,
      armL: -110 + wave(time, 9) * 10,
      armR: -110 - wave(time, 9) * 10,
      antennaY: -4,
      mouth: "open",
      eyeOpen: 0.85,
    });
  }),

  [PetState.Confused]: clip("confused", 0.28, 0.26, true, ({ time }) =>
    pose({
      headRot: 9 + wave(time, 2.2) * 5,
      bodyRot: 6,
      armL: 18,
      armR: -18,
      eyeX: wave(time, 2.6) * 2,
      mouth: "wavy",
      antennaRot: wave(time, 3.4) * 14,
    }),
  ),

  [PetState.Dizzy]: clip("dizzy", 0.16, 0.34, false, ({ time }) =>
    pose({
      bodyRot: wave(time, 11) * 15,
      headRot: wave(time, 9) * 10,
      eyeX: wave(time, 12) * 2.4,
      armL: wave(time, 10) * 26,
      armR: wave(time, 10) * -26,
      mouth: "wavy",
      antennaRot: wave(time, 13) * 22,
    }),
  ),

  [PetState.Peek]: clip("peek", 0.34, 0.3, false, ({ time }) => {
    const k = Math.min(1, time / 2.2);
    return pose({
      headRot: Math.sin(k * Math.PI * 2) * 14,
      eyeX: Math.sin(k * Math.PI * 2) * 3,
      bodyY: 4 - 4 * k,
      mouth: "small",
    });
  }),

  [PetState.Hide]: clip("hide", 0.2, 0.3, true, () => pose({ bodyY: 12 })),

  // Legacy states keep working by reusing the closest clip.
  [PetState.FollowCursor]: clip(
    "follow-cursor",
    0.22,
    0.2,
    true,
    ({ time, speed }) => {
      const gait = Math.max(0.4, Math.min(1.6, speed / 52));
      const stride = time * 9 * gait;
      return pose({
        bodyY: wave(stride, 1) * 2 * gait,
        legSwing: wave(stride, 1) * 9 * gait,
        armL: wave(stride, 1) * -11 * gait,
        armR: wave(stride, 1) * 11 * gait,
      });
    },
  ),
  [PetState.ObserveWindow]: clip(
    "observe-window",
    0.3,
    0.26,
    true,
    ({ time }) =>
      pose({ headRot: wave(time, 0.8) * 7, eyeX: wave(time, 0.8) * 2 }),
  ),
  [PetState.Inspect]: clip("inspect", 0.3, 0.26, true, ({ time }) =>
    pose({
      headRot: 10,
      eyeY: 1.6,
      armR: -40,
      bodyY: wave(time, 1.6) * 0.6,
      mouth: "flat",
    }),
  ),
};

export const DEFAULT_PACK: AnimationPack = { id: "default", clips: CLIPS };

/** Future packs register here; the animator only ever reads through this call. */
export function clipFor(pack: AnimationPack, state: PetState): AnimationClip {
  return pack.clips[state] ?? DEFAULT_PACK.clips[PetState.Idle];
}
