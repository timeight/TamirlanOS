"use client";

import { BrandMark } from "@/components/ui/BrandMark";
import { useTimeout } from "@/hooks/use-timeout";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";

const LOADING_DURATION_MS = 3000;

const SEGMENT_GRADIENT =
  "linear-gradient(180deg, #8b9dff 0%, #3a4ee0 55%, #1b2ab0 100%)";

export function LoadingScreen() {
  const advanceBoot = useSystemStore((state) => state.advanceBoot);
  const t = useT();

  useTimeout(advanceBoot, LOADING_DURATION_MS);

  return (
    <div
      className="animate-fade-in relative flex h-full flex-col items-center justify-center gap-8 bg-black text-white motion-reduce:animate-none sm:gap-14"
      style={{ fontFamily: '"Trebuchet MS", Arial, sans-serif' }}
    >
      <div className="flex flex-col items-center">
        <BrandMark className="h-16 w-16 sm:h-24 sm:w-24" />
        <div className="mt-3">
          <p className="text-4xl leading-none font-bold sm:text-[52px]">
            Tamirlan
            <span className="ml-1 align-super text-lg font-bold text-[#f8682c] italic sm:text-[26px]">
              OS
            </span>
          </p>
          <p className="mt-1 ml-1 text-base italic sm:text-xl">
            {t("login.role")}
          </p>
        </div>
      </div>
      <div
        role="status"
        aria-label={t("boot.loading")}
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
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-5 sm:px-10 sm:pb-8">
        <p className="text-sm leading-5 sm:text-lg sm:leading-6">
          {t("loading.tip")}
        </p>
        <p className="hidden text-2xl font-bold italic sm:block">
          {t("loading.portfolio")}
        </p>
      </div>
    </div>
  );
}
