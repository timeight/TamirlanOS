"use client";

import { useEffect, useRef, useState } from "react";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { DesktopSurface } from "@/components/desktop/DesktopSurface";
import { Taskbar } from "@/components/desktop/Taskbar/Taskbar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WelcomeBalloon } from "@/components/desktop/WelcomeBalloon";
import { WindowHost } from "@/components/desktop/WindowHost";
import { installApps, type AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { useAudioStore } from "@/stores/audio-store";
import { SoundEvent } from "@/types/sound";

export function DesktopShell() {
  const openApp = useOpenApp();
  const play = useAudioStore((state) => state.play);
  const [balloonOpen, setBalloonOpen] = useState(true);

  useEffect(() => {
    installApps();
  }, []);

  // The startup chime belongs to the moment the desktop appears, as in real XP.
  const chimed = useRef(false);
  useEffect(() => {
    if (chimed.current) return;
    chimed.current = true;
    play(SoundEvent.Boot);
  }, [play]);

  const openFromBalloon = (appId: AppKey) => {
    setBalloonOpen(false);
    openApp(appId);
  };

  return (
    <div className="animate-fade-in relative h-full overflow-hidden motion-reduce:animate-none">
      <Wallpaper />
      <DesktopSurface>
        <DesktopIcons onIconOpen={(icon) => openApp(icon.appId)} />
      </DesktopSurface>
      <WindowHost />
      {balloonOpen && (
        <WelcomeBalloon
          onClose={() => setBalloonOpen(false)}
          onOpenApp={openFromBalloon}
        />
      )}
      <Taskbar />
    </div>
  );
}
