"use client";

import { MicroEvent } from "@/core/ambience/micro-events";
import { cn } from "@/core/utils/cn";
import { useAmbience } from "@/hooks/use-ambience";

/**
 * A single pointer-transparent sheet over the wallpaper. Everything it draws
 * animates opacity or transform only, so the desktop stays at 60 fps.
 */
export function AmbientLayer() {
  const { tint, strength, shade, phase, event, calm } = useAmbience();

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 transition-[background-color,opacity] duration-[8000ms] ease-linear motion-reduce:transition-none"
        style={{ backgroundColor: tint, opacity: strength }}
      />
      {shade > 0 && (
        <div
          className="absolute inset-0 bg-black transition-opacity duration-[8000ms] ease-linear motion-reduce:transition-none"
          style={{ opacity: shade }}
        />
      )}

      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent",
          "motion-safe:animate-[desktop-breathe_18s_ease-in-out_infinite]",
          calm && "motion-safe:[animation-duration:34s]",
        )}
      />

      {event === MicroEvent.Cloud && (
        <div className="absolute top-[12%] -left-[40%] h-[38%] w-[46%] rounded-[999px] bg-white/12 blur-3xl motion-safe:animate-[cloud-drift_26s_linear_1]" />
      )}

      {event === MicroEvent.Breeze && (
        <div className="absolute inset-y-0 -left-[30%] w-[30%] bg-gradient-to-r from-transparent via-white/8 to-transparent motion-safe:animate-[breeze-pass_5.2s_ease-in-out_1]" />
      )}

      {event === MicroEvent.Sparkle && (
        <span className="absolute top-[34%] left-[62%] h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.9)] motion-safe:animate-[sparkle_2.4s_ease-in-out_1]" />
      )}

      {event === MicroEvent.LightShift && (
        <div className="absolute inset-0 bg-white/10 motion-safe:animate-[light-shift_14s_ease-in-out_1]" />
      )}
    </div>
  );
}
