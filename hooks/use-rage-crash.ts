"use client";

import { useEffect, useRef } from "react";
import {
  isRage,
  isTextEntry,
  pruneOlderThan,
  RAGE_LIMITS,
} from "@/core/system/rage-detector";
import { useSystemStore } from "@/stores/system-store";

/** Watches for click and key storms and blue-screens the desktop once per session. */
export function useRageCrash(): void {
  const fired = useRef(false);

  useEffect(() => {
    const clicks: number[] = [];
    const keys: number[] = [];

    const evaluate = () => {
      if (fired.current) return;
      if (!isRage(clicks.length, keys.length)) return;
      fired.current = true;
      useSystemStore.getState().crash();
    };

    const onPointer = () => {
      const now = Date.now();
      clicks.push(now);
      clicks.splice(
        0,
        clicks.length,
        ...pruneOlderThan(clicks, now, RAGE_LIMITS.clickWindowMs),
      );
      evaluate();
    };

    const onKey = (event: KeyboardEvent) => {
      if (isTextEntry(event.target)) return;
      const now = Date.now();
      keys.push(now);
      keys.splice(
        0,
        keys.length,
        ...pruneOlderThan(keys, now, RAGE_LIMITS.keyWindowMs),
      );
      evaluate();
    };

    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}
