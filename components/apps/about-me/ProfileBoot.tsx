"use client";

import { useEffect, useState } from "react";
import { BOOT_STEPS } from "@/core/about/profile";

/** Module scope: the decrypt sequence plays once per browser session. */
let alreadyShown = false;

const STEP_MS = 420;

export function ProfileBoot({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= BOOT_STEPS.length) {
      alreadyShown = true;
      const fade = window.setTimeout(onDone, 260);
      return () => window.clearTimeout(fade);
    }
    const timer = window.setTimeout(
      () => setStep((value) => value + 1),
      STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [step, onDone]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050a0f]">
      <ol className="font-mono text-[12px] leading-[2] text-[#5ff85f]">
        {BOOT_STEPS.slice(0, step).map((line) => (
          <li key={line}>
            {line}
            <span className="ml-2 text-[#2f8a4f]">██████████ 100%</span>
          </li>
        ))}
        <li aria-hidden="true">
          <span className="inline-block h-3 w-2 bg-[#5ff85f] motion-safe:animate-[blink_0.7s_step-end_infinite]" />
        </li>
      </ol>
    </div>
  );
}

export function bootAlreadyPlayed(): boolean {
  return alreadyShown;
}
