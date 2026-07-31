"use client";

import { AchievementIcon } from "@/components/ui/AchievementIcon";
import { ACHIEVEMENTS, ACHIEVEMENT_TOTAL } from "@/core/achievements/catalog";
import { cn } from "@/core/utils/cn";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";

export function AchievementsApp() {
  const unlocked = useAchievementStore((state) => state.unlocked);
  const t = useT();
  const count = unlocked.length;
  const percent = Math.round((count / ACHIEVEMENT_TOTAL) * 100);

  return (
    <div className="flex h-full flex-col bg-[#ece9d8] text-[11px] text-black">
      <div className="shrink-0 border-b border-[#aca899] bg-white px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-bold text-[#003399]">
            {t("ach.title")}
          </p>
          <p className="text-[12px] font-bold tabular-nums">
            {count} / {ACHIEVEMENT_TOTAL}
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={ACHIEVEMENT_TOTAL}
          className="mt-2 h-[15px] overflow-hidden rounded-[3px] border border-[#9aa0a6] bg-white p-px"
        >
          <div
            className="flex h-full gap-[2px] transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          >
            {Array.from({ length: Math.max(1, Math.round(percent / 4)) }).map(
              (_, index) => (
                <span
                  key={index}
                  className="h-full w-[8px] shrink-0 rounded-[1px]"
                  style={{
                    background:
                      "linear-gradient(180deg, #b7e77d 0%, #63b427 45%, #2f8a1c 100%)",
                  }}
                />
              ),
            )}
          </div>
        </div>
        <p className="mt-1 text-[10px] text-[#4a5a70]">
          {t("ach.progress", { percent })}
        </p>
      </div>

      <ul className="min-h-0 flex-1 overflow-auto p-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id);
          const hidden = achievement.secret && !isUnlocked;
          return (
            <li
              key={achievement.id}
              className={cn(
                "mb-1.5 flex items-center gap-2.5 rounded-[3px] border px-2.5 py-2",
                isUnlocked
                  ? "border-[#c8d8ea] bg-white"
                  : "border-[#d8d4c6] bg-[#f4f2ea]",
              )}
            >
              <AchievementIcon
                icon={hidden ? "star" : achievement.icon}
                locked={!isUnlocked}
                className="h-9 w-9"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-[12px] font-bold",
                    isUnlocked ? "text-black" : "text-[#8a867a]",
                  )}
                >
                  {hidden ? t("ach.hidden") : t(achievement.titleKey)}
                </p>
                <p className="truncate text-[10px] text-[#5a6470]">
                  {hidden ? t("ach.hidden.d") : t(achievement.descKey)}
                </p>
              </div>
              {isUnlocked && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[13px] font-bold text-[#2f8a1c]"
                >
                  ✓
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
