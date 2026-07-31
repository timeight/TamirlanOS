"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Effect = "confetti" | "glitch" | "flicker" | null;

const CONFETTI_MS = 2600;
const GLITCH_MS = 1800;
const FLICKER_MS = 1400;
const CONFETTI_COLORS = [
  "#5fd4ff",
  "#c6f24e",
  "#f2c14e",
  "#e0574a",
  "#b98ae0",
  "#7cc48a",
] as const;

/**
 * A pure subscriber: it reacts to world events and knows nothing about the
 * systems that published them.
 */
export function WorldEffects() {
  const [effect, setEffect] = useState<Effect>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timers: number[] = [];
    const run = (next: Effect, ms: number) => {
      setEffect(next);
      timers.push(window.setTimeout(() => setEffect(null), ms));
    };

    const unsubscribers = [
      subscribe(WorldEventType.AchievementUnlocked, () =>
        run("confetti", CONFETTI_MS),
      ),
      subscribe(WorldEventType.PuzzleSolved, () =>
        run("confetti", CONFETTI_MS),
      ),
      subscribe(WorldEventType.TimeMachine, () => run("glitch", GLITCH_MS)),
      subscribe(WorldEventType.LostFiles, (event) => {
        if (event.active) run("flicker", FLICKER_MS);
      }),
      subscribe(WorldEventType.SystemError, () => run("flicker", FLICKER_MS)),
    ];

    return () => {
      unsubscribers.forEach((off) => off());
      timers.forEach(window.clearTimeout);
    };
  }, [reducedMotion]);

  if (!effect) return null;

  if (effect === "confetti") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[62] overflow-hidden"
      >
        {Array.from({ length: 60 }).map((_, index) => {
          const left = (index * 37) % 100;
          const delay = (index % 12) * 0.08;
          const size = 5 + (index % 4) * 2;
          return (
            <span
              key={index}
              className="absolute top-[-16px] animate-[confetti-fall_2.4s_linear_forwards]"
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.6,
                background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={
        effect === "glitch"
          ? "pointer-events-none absolute inset-0 z-[62] animate-[world-shake_180ms_linear_infinite] bg-[#5fd4ff]/5"
          : "pointer-events-none absolute inset-0 z-[62] animate-[world-flicker_320ms_steps(2,end)_infinite] bg-black/35"
      }
    />
  );
}
