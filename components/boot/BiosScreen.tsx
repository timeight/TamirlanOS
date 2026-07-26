"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTimeout } from "@/hooks/use-timeout";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";

const LINE_INTERVAL_MS = 320;
const HOLD_AFTER_LAST_MS = 700;
const LINE_COUNT = 6;

export function BiosScreen() {
  const advanceBoot = useSystemStore((state) => state.advanceBoot);
  const reducedMotion = useReducedMotion();
  const t = useT();
  const lines = [
    "TamirlanOS BIOS v1.0",
    "Build 0.1.0 / 2026",
    t("boot.memtest"),
    t("boot.audio"),
    t("boot.display"),
    t("boot.booting"),
  ];
  const [revealed, setRevealed] = useState(1);
  const visible = reducedMotion ? LINE_COUNT : revealed;

  useEffect(() => {
    if (visible >= LINE_COUNT) return;
    const id = window.setTimeout(
      () => setRevealed((count) => count + 1),
      LINE_INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [visible]);

  useTimeout(
    advanceBoot,
    reducedMotion
      ? HOLD_AFTER_LAST_MS
      : LINE_COUNT * LINE_INTERVAL_MS + HOLD_AFTER_LAST_MS,
  );

  return (
    <div className="h-full bg-black p-6 font-mono text-sm leading-6 text-white">
      {lines.slice(0, visible).map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p
        aria-hidden="true"
        className="animate-blink motion-reduce:animate-none"
      >
        _
      </p>
    </div>
  );
}
