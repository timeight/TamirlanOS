"use client";

import { useEffect, useRef, useState } from "react";
import { PetAnimator } from "@/core/pet/animation/animator";
import { applyMicro, createMicro } from "@/core/pet/animation/micro";
import { REST_POSE, type Pose } from "@/core/pet/animation/pose";
import { PetState, type PetFrame, type PetVector } from "@/core/pet/pet-types";

interface AnimatorOptions {
  frame: PetFrame;
  reducedMotion: boolean;
  /** Where PIX is looking, in screen pixels. */
  lookAt: PetVector | null;
}

/** Runs the animation clock separately from the brain, so visuals never stall. */
export function usePetAnimator({
  frame,
  reducedMotion,
  lookAt,
}: AnimatorOptions): Pose {
  const animator = useRef<PetAnimator | null>(null);
  animator.current ??= new PetAnimator();
  const micro = useRef(createMicro());
  const [pose, setPose] = useState<Pose>(REST_POSE);

  const latest = useRef({ frame, lookAt, reducedMotion });
  latest.current = { frame, lookAt, reducedMotion };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const snapshot = latest.current;
      const engine = animator.current!;

      engine.play(snapshot.frame.state);
      const clipPose = engine.update({
        dt,
        speed: snapshot.frame.speed,
      });

      const dx = snapshot.lookAt
        ? (snapshot.lookAt.x - snapshot.frame.position.x) / 220
        : 0;
      const dy = snapshot.lookAt
        ? (snapshot.lookAt.y - snapshot.frame.position.y) / 200
        : 0;

      const result = applyMicro(clipPose, micro.current, {
        dt,
        lookX: Math.max(-1, Math.min(1, dx)) * snapshot.frame.facing,
        lookY: Math.max(-1, Math.min(1, dy)),
        awake: snapshot.frame.state !== PetState.Sleep,
        reducedMotion: snapshot.reducedMotion,
      });
      micro.current = result.state;
      setPose(result.pose);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return pose;
}
