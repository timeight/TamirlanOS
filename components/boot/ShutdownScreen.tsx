"use client";

import { useTimeout } from "@/hooks/use-timeout";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";

// Matches the audio guideline: shutdown fade never waits longer than two seconds.
const SHUTDOWN_DURATION_MS = 2000;

export function ShutdownScreen() {
  const powerOff = useSystemStore((state) => state.powerOff);
  const t = useT();

  useTimeout(powerOff, SHUTDOWN_DURATION_MS);

  return (
    <div
      className="flex h-full items-center justify-center px-4 text-center text-white"
      style={{
        background:
          "linear-gradient(180deg, #7a99e1 0%, #5f7fd0 50%, #4a69be 100%)",
      }}
    >
      <p
        className="animate-fade-in text-2xl font-bold italic motion-reduce:animate-none sm:text-4xl"
        style={{
          fontFamily: '"Trebuchet MS", Arial, sans-serif',
          textShadow: "2px 2px 4px rgba(0, 20, 90, 0.6)",
        }}
      >
        {t("boot.shuttingdown")}
      </p>
    </div>
  );
}
