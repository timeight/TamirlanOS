"use client";

import { useEffect } from "react";
import { AchievementIcon } from "@/components/ui/AchievementIcon";
import { AppKey } from "@/core/apps/app-catalog";
import { findAchievement } from "@/core/achievements/catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useAudioStore } from "@/stores/audio-store";
import { SoundEvent } from "@/types/sound";

const VISIBLE_MS = 5200;

export function AchievementBalloon() {
  const currentId = useAchievementStore((state) => state.queue[0]);
  const dismiss = useAchievementStore((state) => state.dismissBalloon);
  const play = useAudioStore((state) => state.play);
  const openApp = useOpenApp();
  const t = useT();

  useEffect(() => {
    if (!currentId) return;
    play(SoundEvent.Notification);
    const timer = window.setTimeout(dismiss, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [currentId, dismiss, play]);

  if (!currentId) return null;
  const achievement = findAchievement(currentId);
  if (!achievement) return null;

  return (
    <div
      role="status"
      onClick={() => {
        dismiss();
        openApp(AppKey.Achievements);
      }}
      className="animate-fade-in absolute right-3 bottom-[40px] z-[60] w-[min(300px,calc(100vw-24px))] cursor-pointer rounded-md border border-[var(--os-balloon-border)] bg-[var(--os-balloon-background)] p-3 text-black shadow-[2px_2px_8px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
    >
      <span
        aria-hidden="true"
        className="absolute right-9 -bottom-[7px] h-3.5 w-3.5 rotate-45 border-r border-b border-[var(--os-balloon-border)] bg-[var(--os-balloon-background)]"
      />
      <div className="flex items-start gap-2.5">
        <AchievementIcon
          icon={achievement.icon}
          className="h-9 w-9 motion-safe:animate-[fade-in_400ms_ease-out]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-wide text-[#8a6d10] uppercase">
            {t("ach.unlocked")}
          </p>
          <p className="text-[13px] font-bold">{t(achievement.titleKey)}</p>
          <p className="mt-0.5 text-[11px] leading-4 text-[#444]">
            {t(achievement.descKey)}
          </p>
        </div>
        <button
          type="button"
          aria-label={t("balloon.close")}
          onClick={(event) => {
            event.stopPropagation();
            dismiss();
          }}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[#555] hover:bg-black/10 focus-visible:outline-1 focus-visible:outline-black"
        >
          <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2 w-2">
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
