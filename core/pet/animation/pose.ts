export type MouthShape = "smile" | "flat" | "wavy" | "open" | "small";

/** Every animatable channel of the rig. Clips return a full pose; the animator blends them. */
export interface Pose {
  bodyY: number;
  bodyRot: number;
  bodySquash: number;
  headRot: number;
  headY: number;
  armL: number;
  armR: number;
  legSwing: number;
  sit: number;
  eyeOpen: number;
  eyeX: number;
  eyeY: number;
  browY: number;
  antennaY: number;
  antennaRot: number;
  mouth: MouthShape;
  zzz: number;
}

export const REST_POSE: Pose = {
  bodyY: 0,
  bodyRot: 0,
  bodySquash: 1,
  headRot: 0,
  headY: 0,
  armL: 0,
  armR: 0,
  legSwing: 0,
  sit: 0,
  eyeOpen: 1,
  eyeX: 0,
  eyeY: 0,
  browY: 0,
  antennaY: 0,
  antennaRot: 0,
  mouth: "smile",
  zzz: 0,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Numeric channels cross-fade; the mouth switches at the halfway point. */
export function blendPose(from: Pose, to: Pose, t: number): Pose {
  const k = Math.max(0, Math.min(1, t));
  return {
    bodyY: lerp(from.bodyY, to.bodyY, k),
    bodyRot: lerp(from.bodyRot, to.bodyRot, k),
    bodySquash: lerp(from.bodySquash, to.bodySquash, k),
    headRot: lerp(from.headRot, to.headRot, k),
    headY: lerp(from.headY, to.headY, k),
    armL: lerp(from.armL, to.armL, k),
    armR: lerp(from.armR, to.armR, k),
    legSwing: lerp(from.legSwing, to.legSwing, k),
    sit: lerp(from.sit, to.sit, k),
    eyeOpen: lerp(from.eyeOpen, to.eyeOpen, k),
    eyeX: lerp(from.eyeX, to.eyeX, k),
    eyeY: lerp(from.eyeY, to.eyeY, k),
    browY: lerp(from.browY, to.browY, k),
    antennaY: lerp(from.antennaY, to.antennaY, k),
    antennaRot: lerp(from.antennaRot, to.antennaRot, k),
    mouth: k < 0.5 ? from.mouth : to.mouth,
    zzz: lerp(from.zzz, to.zzz, k),
  };
}

export function addPose(base: Pose, delta: Partial<Pose>): Pose {
  return {
    ...base,
    bodyY: base.bodyY + (delta.bodyY ?? 0),
    bodyRot: base.bodyRot + (delta.bodyRot ?? 0),
    bodySquash: base.bodySquash * (delta.bodySquash ?? 1),
    headRot: base.headRot + (delta.headRot ?? 0),
    headY: base.headY + (delta.headY ?? 0),
    eyeOpen: Math.max(0, Math.min(1, base.eyeOpen * (delta.eyeOpen ?? 1))),
    eyeX: base.eyeX + (delta.eyeX ?? 0),
    eyeY: base.eyeY + (delta.eyeY ?? 0),
    antennaY: base.antennaY + (delta.antennaY ?? 0),
    antennaRot: base.antennaRot + (delta.antennaRot ?? 0),
  };
}

/** Smoothstep keeps cross-fades from starting and ending abruptly. */
export function easeInOut(t: number): number {
  const k = Math.max(0, Math.min(1, t));
  return k * k * (3 - 2 * k);
}
