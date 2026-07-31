"use client";

import { useEffect } from "react";
import { AchievementId } from "@/core/achievements/catalog";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useSystemStore } from "@/stores/system-store";

const VISIBLE_MS = 1500;

export function BsodScreen() {
  const crashReboot = useSystemStore((state) => state.crashReboot);
  const t = useT();

  useEffect(() => {
    useAchievementStore.getState().unlock(AchievementId.BlueScreen);
    const timer = window.setTimeout(crashReboot, VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [crashReboot]);

  return (
    <div
      role="alert"
      className="flex h-full flex-col justify-center bg-[#0000aa] px-5 font-mono text-[12px] leading-[1.5] text-white sm:px-16 sm:text-[14px]"
    >
      <p className="mx-auto mb-5 bg-[#aaaaaa] px-3 py-0.5 text-[#0000aa]">
        TamirlanOS
      </p>
      <p>{t("bsod.line1")}</p>
      <p className="mt-3">{t("bsod.line2")}</p>
      <p className="mt-3">{t("bsod.line3")}</p>
      <p className="mt-5">
        *** STOP: 0x000000EA (0x00000FUN, 0x0000RAGE, 0x00CLICK, 0x00000000)
      </p>
      <p className="mt-1">
        *** patience.sys — Address 0xBAADF00D base at 0x2026
      </p>
      <p className="mt-5">{t("bsod.reboot")}</p>
    </div>
  );
}
