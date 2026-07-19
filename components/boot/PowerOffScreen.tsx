"use client";

import { unlockAudio } from "@/core/audio/audio-manager";
import { useSystemStore } from "@/stores/system-store";

export function PowerOffScreen() {
  const powerOn = useSystemStore((state) => state.powerOn);

  // The power gesture doubles as the browser's audio unlock, so the boot sound may play later.
  const handlePowerOn = () => {
    unlockAudio();
    powerOn();
  };

  return (
    <div className="flex h-full items-center justify-center bg-black">
      <button
        type="button"
        onClick={handlePowerOn}
        aria-label="Power on TamirlanOS"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white/50 transition-colors duration-150 hover:border-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path d="M12 3v8" />
          <path d="M6.3 6.5a8 8 0 1 0 11.4 0" />
        </svg>
      </button>
    </div>
  );
}
