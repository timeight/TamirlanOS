"use client";

import { useTimeout } from "@/hooks/use-timeout";
import { useSystemStore } from "@/stores/system-store";

// Matches the audio guideline: shutdown fade never waits longer than two seconds.
const SHUTDOWN_DURATION_MS = 2000;

export function ShutdownScreen() {
  const powerOff = useSystemStore((state) => state.powerOff);

  useTimeout(powerOff, SHUTDOWN_DURATION_MS);

  return (
    <div
      className="flex h-full items-center justify-center text-white"
      style={{
        background:
          "linear-gradient(180deg, #7a99e1 0%, #5f7fd0 50%, #4a69be 100%)",
      }}
    >
      <p
        className="animate-fade-in text-4xl font-bold italic motion-reduce:animate-none"
        style={{
          fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
          textShadow: "2px 2px 4px rgba(0, 20, 90, 0.6)",
        }}
      >
        TamirlanOS is shutting down...
      </p>
    </div>
  );
}
