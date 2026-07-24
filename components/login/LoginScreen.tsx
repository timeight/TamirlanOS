"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { BrandMark } from "@/components/ui/BrandMark";
import { siteConfig } from "@/core/config/site";
import { useAudioStore } from "@/stores/audio-store";
import { useSystemStore } from "@/stores/system-store";
import { SoundEvent } from "@/types/sound";

const USERNAME = "Tamirlan";
const ROLE = "Software Developer · AI Engineer";

const FIELD_BACKGROUND =
  "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.035) 0px, rgba(255, 255, 255, 0.035) 1px, transparent 1px, transparent 3px), linear-gradient(180deg, #7a99e1 0%, #5f7fd0 50%, #4a69be 100%)";

export function LoginScreen() {
  const logIn = useSystemStore((state) => state.logIn);
  const restart = useSystemStore((state) => state.restart);
  const play = useAudioStore((state) => state.play);

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
        className="flex flex-1 items-center"
        style={{ background: FIELD_BACKGROUND }}
      >
        <div className="flex flex-1 justify-end pr-14">
          <div
            className="flex flex-col items-start text-white"
            style={{ fontFamily: '"Trebuchet MS", Tahoma, sans-serif' }}
          >
            <BrandMark className="ml-8 h-24 w-24" />
            <p className="mt-2 text-4xl font-bold">
              Tamirlan
              <span className="ml-1 align-super text-xl font-bold text-[#f8682c] italic">
                OS
              </span>
            </p>
            <p className="mt-0.5 text-base italic">{ROLE}</p>
            <p
              className="mt-12 text-lg"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              To begin, click on {USERNAME} to log in
            </p>
          </div>
        </div>
        <div className="mx-10 h-3/5 w-px self-center bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        <div className="flex flex-1 items-center">
          <button
            type="button"
            onClick={handleSignIn}
            aria-label={`Sign in as ${USERNAME}`}
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
              <span className="block text-3xl text-white">{USERNAME}</span>
              <span className="mt-0.5 block text-[13px] font-bold text-[#16307e]">
                {ROLE}
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
          Restart TamirlanOS
        </button>
      </div>
    </div>
  );
}
