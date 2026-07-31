"use client";

import { useEffect, useRef, useState } from "react";
import { WindowState } from "@/types/window";

export type WindowPhase =
  "opening" | "idle" | "minimizing" | "restoring" | "hidden" | "closing";

/** Milliseconds each transient phase runs before settling. */
const DURATION: Partial<Record<WindowPhase, number>> = {
  opening: 140,
  minimizing: 160,
  restoring: 170,
  closing: 120,
};

function instant(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Drives the window's lifecycle animation. The store stays synchronous; only
 * the final removal waits, so a closing window never blocks focus handoff.
 */
export function useWindowTransition(
  state: WindowState,
  closing: boolean,
  onClosed: () => void,
): WindowPhase {
  const [phase, setPhase] = useState<WindowPhase>(
    state === WindowState.Minimized ? "hidden" : "opening",
  );
  const previous = useRef(state);

  useEffect(() => {
    const from = previous.current;
    previous.current = state;
    if (from === state) return;
    if (state === WindowState.Minimized) setPhase("minimizing");
    else if (from === WindowState.Minimized) setPhase("restoring");
  }, [state]);

  useEffect(() => {
    if (closing) setPhase("closing");
  }, [closing]);

  useEffect(() => {
    const duration = DURATION[phase];
    if (duration === undefined) return;
    const timer = window.setTimeout(
      () => {
        if (phase === "closing") {
          onClosed();
          return;
        }
        setPhase(phase === "minimizing" ? "hidden" : "idle");
      },
      instant() ? 0 : duration,
    );
    return () => window.clearTimeout(timer);
  }, [phase, onClosed]);

  return phase;
}
