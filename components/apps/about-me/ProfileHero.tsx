"use client";

import { useEffect, useState } from "react";
import { ProfilePortrait } from "@/components/apps/about-me/ProfilePortrait";
import { TYPED_LINES } from "@/core/about/profile";
import { cn } from "@/core/utils/cn";

const TYPE_MS = 55;
const HOLD_MS = 2200;

/** Types a line, holds, erases, moves on. One timer, no layout reads. */
function useTypewriter(lines: readonly string[]): string {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const line = lines[index] ?? "";
    if (!erasing && count === line.length) {
      const hold = window.setTimeout(() => setErasing(true), HOLD_MS);
      return () => window.clearTimeout(hold);
    }
    if (erasing && count === 0) {
      setErasing(false);
      setIndex((value) => (value + 1) % lines.length);
      return;
    }
    const step = window.setTimeout(
      () => setCount((value) => value + (erasing ? -1 : 1)),
      erasing ? TYPE_MS / 2 : TYPE_MS,
    );
    return () => window.clearTimeout(step);
  }, [lines, index, count, erasing]);

  return (lines[index] ?? "").slice(0, count);
}

export function ProfileHero() {
  const typed = useTypewriter(TYPED_LINES);
  const [glitch, setGlitch] = useState(false);

  return (
    <section className="grid gap-6 @[720px]:grid-cols-[1fr_auto] @[720px]:items-start">
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.4em] text-[#5f8db0]">
          HELLO, I&apos;M
        </p>
        <h1
          onMouseEnter={() => setGlitch(true)}
          onMouseLeave={() => setGlitch(false)}
          className={cn(
            "mt-2 font-mono text-[clamp(34px,7.4vw,68px)] leading-[0.92] font-bold tracking-[0.02em] text-white",
            glitch &&
              "[text-shadow:2px_0_#ff004c,-2px_0_#00e5ff] motion-safe:animate-[glitch_180ms_steps(2,end)_infinite]",
          )}
        >
          TAMIRLAN
          <br />
          ZHAMALOV
        </h1>
        <p className="mt-3 font-mono text-[clamp(12px,1.8vw,17px)] tracking-[0.14em] text-[#5ff85f]">
          3D ARTIST <span className="text-[#3f5d78]">•</span> DEVELOPER{" "}
          <span className="text-[#3f5d78]">•</span> CREATOR
        </p>

        <p className="mt-4 inline-flex max-w-full items-center gap-2 border border-[#22384c] bg-[#0a1119] px-3 py-2 font-mono text-[11px] text-[#9fd8ff]">
          <span className="text-[#5ff85f]">&gt;</span>
          <span className="truncate">{typed}</span>
          <span className="inline-block h-3 w-[7px] shrink-0 bg-[#5ff85f] motion-safe:animate-[blink_1s_step-end_infinite]" />
        </p>
      </div>

      <div className="relative justify-self-center @[720px]:justify-self-end">
        <p className="mb-2 flex items-center justify-end gap-1.5 font-mono text-[10px] tracking-[0.2em] text-[#5ff85f]">
          ONLINE
          <span className="inline-block h-2 w-2 rounded-full bg-[#5ff85f] motion-safe:animate-[blink_2.4s_step-end_infinite]" />
        </p>
        <ProfilePortrait />
      </div>
    </section>
  );
}
