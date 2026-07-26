"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { BrandMark } from "@/components/ui/BrandMark";
import { siteConfig } from "@/core/config/site";
import { useT } from "@/hooks/use-translations";
import { useAudioStore } from "@/stores/audio-store";
import { useSystemStore } from "@/stores/system-store";
import { SoundEvent } from "@/types/sound";

const FIELD_BACKGROUND =
  "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.035) 0px, rgba(255, 255, 255, 0.035) 1px, transparent 1px, transparent 3px), linear-gradient(180deg, #7a99e1 0%, #5f7fd0 50%, #4a69be 100%)";

export function LoginScreen() {
  const logIn = useSystemStore((state) => state.logIn);
  const restart = useSystemStore((state) => state.restart);
  const play = useAudioStore((state) => state.play);
  const t = useT();
  const username = t("user.name");

  const handleSignIn = () => {
    play(SoundEvent.Login);
    logIn();
  };

  const handleRestart = () => {
    play(SoundEvent.Shutdown);
    restart();
  };

  return (
    <div className="animate-fade-in flex h-full flex-col motion-reduce:animate-none">
      <div className="h-[13%] min-h-14 bg-[#00309c]" />
      <div
        className="flex flex-1 flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:justify-normal sm:gap-0 sm:px-0"
        style={{ background: FIELD_BACKGROUND }}
      >
        <div className="flex w-full justify-center sm:flex-1 sm:justify-end sm:pr-14">
          <div
            className="flex flex-col items-center text-center text-white sm:items-start sm:text-left"
            style={{ fontFamily: '"Trebuchet MS", Arial, sans-serif' }}
          >
            <BrandMark className="h-20 w-20 sm:ml-8 sm:h-24 sm:w-24" />
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              Tamirlan
              <span className="ml-1 align-super text-lg font-bold text-[#f8682c] italic sm:text-xl">
                OS
              </span>
            </p>
            <p className="mt-0.5 text-base italic">{t("login.role")}</p>
            <p
              className="mt-4 text-base sm:mt-12 sm:text-lg"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {t("login.begin", { name: username })}
            </p>
          </div>
        </div>
        <div className="mx-10 hidden h-3/5 w-px self-center bg-gradient-to-b from-transparent via-white/60 to-transparent sm:block" />
        <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:justify-normal">
          <button
            type="button"
            onClick={handleSignIn}
            aria-label={t("login.signin", { name: username })}
            className="group flex items-center gap-4 rounded-md p-3 text-left transition-colors duration-150 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            <Image
              src={siteConfig.avatarSrc}
              alt=""
              width={72}
              height={72}
              unoptimized
              draggable={false}
              className="rounded-lg border-2 border-white/90 shadow-md"
            />
            <span>
              <span className="block text-3xl text-white">{username}</span>
              <span className="mt-0.5 block text-[13px] font-bold text-[#16307e]">
                {t("login.role")}
              </span>
            </span>
          </button>
        </div>
      </div>
      <div
        className="flex h-[13%] min-h-14 items-center border-t-2 bg-[#00309c] px-8"
        style={{ borderColor: "#f0a63c" }}
      >
        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-[15px] text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-white/40"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #9fe07a, #2f8a1c 75%)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M19 12a7 7 0 1 1-3-5.7" />
              <path d="M16.5 2.5v4h-4" />
            </svg>
          </span>
          {t("login.restart")}
        </button>
      </div>
    </div>
  );
}
