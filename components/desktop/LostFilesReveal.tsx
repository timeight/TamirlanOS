"use client";

import { useEffect } from "react";
import { AppKey } from "@/core/apps/app-catalog";
import { clueKey } from "@/core/lost-files/discovery";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAudioStore } from "@/stores/audio-store";
import { useLostFilesStore } from "@/stores/lost-files-store";
import { SoundEvent } from "@/types/sound";

const FREEZE_MS = 500;

/**
 * The one moment the OS admits something was hidden: the desktop locks for
 * half a second, glitches, then Explorer opens on the archive by itself.
 */
export function LostFilesReveal() {
  const phase = useLostFilesStore((state) => state.phase);
  const source = useLostFilesStore((state) => state.source);
  const settle = useLostFilesStore((state) => state.settle);
  const play = useAudioStore((state) => state.play);
  const openApp = useOpenApp();
  const t = useT();

  useEffect(() => {
    if (phase !== "freeze") return;
    play(SoundEvent.Error);
    const timer = window.setTimeout(() => {
      settle();
      openApp(AppKey.LostFiles);
    }, FREEZE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, settle, openApp, play]);

  if (phase !== "freeze") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] flex cursor-wait items-center justify-center bg-black/45 backdrop-grayscale motion-safe:animate-[world-flicker_140ms_steps(2,end)_3]"
    >
      <div className="motion-safe:animate-glitch border border-[#3f4a5a] bg-[#12161d]/95 px-5 py-3 text-center shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        <p className="font-mono text-[13px] tracking-[0.14em] text-[#e6e2d6] uppercase">
          {t("lost.detected")}
        </p>
        {source && (
          <p className="mt-1 font-mono text-[11px] text-[#7d828c]">
            {t(clueKey(source))}
          </p>
        )}
      </div>
    </div>
  );
}
