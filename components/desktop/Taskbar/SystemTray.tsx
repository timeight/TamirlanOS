"use client";

import { useEffect, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { AchievementId } from "@/core/achievements/catalog";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useAudioStore } from "@/stores/audio-store";
import { usePetStore } from "@/stores/pet-store";
import { useDesktopStore } from "@/stores/desktop-store";

const trayButtonClass =
  "flex items-center px-1 text-white transition-[filter] duration-100 hover:brightness-125 focus-visible:outline-1 focus-visible:outline-white aria-pressed:brightness-75 motion-reduce:transition-none";

export function SystemTray() {
  const muted = useAudioStore((state) => state.muted);
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const toggleCrt = useDesktopStore((state) => state.toggleCrt);
  const openApp = useOpenApp();
  const petEnabled = usePetStore((state) => state.enabled);
  const togglePet = usePetStore((state) => state.toggleEnabled);
  const t = useT();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="flex items-stretch">
      <button
        type="button"
        title={t("app.agent")}
        aria-label={t("app.agent")}
        onClick={() => openApp(AppKey.Agent)}
        className={trayButtonClass}
      >
        <AssetImage
          src="/assets/icons/agent.svg"
          alt=""
          width={16}
          height={16}
          unoptimized
          draggable={false}
          className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
        />
      </button>
      <button
        type="button"
        aria-label="Open the welcome tour"
        onClick={() => openApp(AppKey.Welcome)}
        className={trayButtonClass}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
          <path d="M9 9.5c1.8 2 4.2 2 6 0" />
        </svg>
      </button>
      <button
        type="button"
        title={t("pix.toggle")}
        aria-label={t("pix.toggle")}
        aria-pressed={petEnabled}
        onClick={togglePet}
        className={trayButtonClass}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="5" y="8" width="14" height="10" rx="4" />
          <path d="M12 8V4.5M9.5 13h.01M14.5 13h.01" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Toggle CRT monitor effect"
        aria-pressed={crtEnabled}
        onClick={() => {
          useAchievementStore.getState().unlock(AchievementId.Retro);
          toggleCrt();
        }}
        className={trayButtonClass}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M7 8h.01M7 11h.01M7 14h.01M11 8h.01M11 11h.01M11 14h.01M15 8h.01M15 11h.01" />
          <path d="M9 20h6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Toggle fullscreen"
        aria-pressed={fullscreen}
        onClick={toggleFullscreen}
        className={trayButtonClass}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      </button>
      <div
        role="status"
        aria-label={muted ? "Audio muted" : "Audio on"}
        className="flex items-center px-1.5 text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-[15px] w-[15px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
        >
          <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
          {muted ? (
            <path d="M16 9l5 6M21 9l-5 6" />
          ) : (
            <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
          )}
        </svg>
      </div>
    </div>
  );
}
