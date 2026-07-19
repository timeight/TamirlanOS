"use client";

import { useEffect, useRef } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useTimeout } from "@/hooks/use-timeout";
import { useAudioStore } from "@/stores/audio-store";
import { useSystemStore } from "@/stores/system-store";
import { SoundEvent } from "@/types/sound";

const LOADING_DURATION_MS = 3000;

const SEGMENT_GRADIENT =
  "linear-gradient(180deg, #8b9dff 0%, #3a4ee0 55%, #1b2ab0 100%)";

export function LoadingScreen() {
  const advanceBoot = useSystemStore((state) => state.advanceBoot);
  const play = useAudioStore((state) => state.play);

  // Guard against React strict-mode effect re-runs: boot plays once per session.
  const played = useRef(false);
  useEffect(() => {
    if (played.current) return;
    played.current = true;
    play(SoundEvent.Boot);
  }, [play]);

  useTimeout(advanceBoot, LOADING_DURATION_MS);

  return (
    <div
      className="animate-fade-in relative flex h-full flex-col items-center justify-center gap-14 bg-black text-white motion-reduce:animate-none"
      style={{ fontFamily: '"Trebuchet MS", Tahoma, sans-serif' }}
    >
      <div className="flex flex-col items-center">
        <BrandMark className="h-24 w-24" />
        <div className="mt-3">
          <p className="text-[52px] leading-none font-bold">
            Tamirlan
            <span className="ml-1 align-super text-[26px] font-bold text-[#f8682c] italic">
              OS
            </span>
          </p>
          <p className="mt-1 ml-1 text-xl italic">
            Software Developer · AI Engineer
          </p>
        </div>
      </div>
      <div
        role="status"
        aria-label="Loading TamirlanOS"
        className="mt-4 h-[15px] w-[176px] overflow-hidden rounded-[8px] border-2 border-[#b8b8b8]/80 p-px"
      >
        <div className="animate-xp-progress flex h-full w-[34px] gap-[2px] motion-reduce:animate-none">
          <span
            className="h-full w-[10px] rounded-[2px]"
            style={{ background: SEGMENT_GRADIENT }}
          />
          <span
            className="h-full w-[10px] rounded-[2px]"
            style={{ background: SEGMENT_GRADIENT }}
          />
          <span
            className="h-full w-[10px] rounded-[2px]"
            style={{ background: SEGMENT_GRADIENT }}
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-8">
        <p className="text-lg leading-6">
          For the best experience
          <br />
          Enter Full Screen (F11)
        </p>
        <p className="text-2xl font-bold italic">Portfolio</p>
      </div>
    </div>
  );
}
