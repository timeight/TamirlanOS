"use client";

import { useEffect, useRef, useState } from "react";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { AchievementBalloon } from "@/components/desktop/AchievementBalloon";
import { AchievementTracker } from "@/components/desktop/AchievementTracker";
import { AgentNudge } from "@/components/desktop/AgentNudge";
import { DesktopSurface } from "@/components/desktop/DesktopSurface";
import { NotificationToast } from "@/components/desktop/NotificationToast";
import { PixPet } from "@/components/desktop/pet/PixPet";
import { Taskbar } from "@/components/desktop/Taskbar/Taskbar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WelcomeBalloon } from "@/components/desktop/WelcomeBalloon";
import { WindowHost } from "@/components/desktop/WindowHost";
import { installApps, type AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAudioStore } from "@/stores/audio-store";
import { useNotificationStore } from "@/stores/notification-store";
import { SoundEvent } from "@/types/sound";

const AGENT_GREETING_DELAY_MS = 2600;

export function DesktopShell() {
  const openApp = useOpenApp();
  const play = useAudioStore((state) => state.play);
  const notify = useNotificationStore((state) => state.notify);
  const t = useT();
  const [balloonOpen, setBalloonOpen] = useState(true);

  useEffect(() => {
    installApps();
  }, []);

  // The agent lives in the tray and says hello shortly after the desktop settles.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      notify({
        iconSrc: "/assets/icons/agent.svg",
        title: t("agent.botName"),
        body: t("agent.trayHint"),
      });
    }, AGENT_GREETING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [notify, t]);

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
      <PixPet />
      <AchievementTracker />
      <AchievementBalloon />
      <AgentNudge />
      <NotificationToast />
      <Taskbar />
    </div>
  );
}
