"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { AchievementBalloon } from "@/components/desktop/AchievementBalloon";
import { AmbientLayer } from "@/components/desktop/AmbientLayer";
import { LostFilesReveal } from "@/components/desktop/LostFilesReveal";
import { RestoreSessionDialog } from "@/components/desktop/RestoreSessionDialog";
import { AchievementTracker } from "@/components/desktop/AchievementTracker";
import { AgentNudge } from "@/components/desktop/AgentNudge";
import { DesktopSurface } from "@/components/desktop/DesktopSurface";
import { NotificationToast } from "@/components/desktop/NotificationToast";
import { PixPet } from "@/components/desktop/pet/PixPet";
import { WorldEffects } from "@/components/desktop/WorldEffects";
import { Taskbar } from "@/components/desktop/Taskbar/Taskbar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WelcomeBalloon } from "@/components/desktop/WelcomeBalloon";
import { WindowHost } from "@/components/desktop/WindowHost";
import type { AppKey } from "@/core/apps/app-catalog";
import { bootKernel } from "@/core/kernel/boot";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useIcqEngine } from "@/hooks/use-icq-engine";
import { useSessionEngine } from "@/hooks/use-session-engine";
import { useLostFilesDiscovery } from "@/hooks/use-lost-files-discovery";
import { useWorldPublishers } from "@/hooks/use-world-publishers";
import { useAudioStore } from "@/stores/audio-store";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { useContextMenuStore } from "@/stores/context-menu-store";
import { useDesktopMenu } from "@/hooks/use-desktop-menu";
import { useDesktopStore } from "@/stores/desktop-store";
import { useNotificationStore } from "@/stores/notification-store";
import { SoundEvent } from "@/types/sound";

const AGENT_GREETING_DELAY_MS = 2600;

export function DesktopShell() {
  const openApp = useOpenApp();
  const play = useAudioStore((state) => state.play);
  const notify = useNotificationStore((state) => state.notify);
  const t = useT();
  const [balloonOpen, setBalloonOpen] = useState(true);
  // Иконки рабочего стола статичны, поэтому «Обновить» перерисовывает слой
  // и снимает выделение — ровно то, что делает F5 в проводнике Windows.
  const [surfaceKey, setSurfaceKey] = useState(0);
  const clearSelection = useDesktopStore((state) => state.clearSelection);
  const hideMenu = useContextMenuStore((state) => state.hide);

  const refreshDesktop = useCallback(() => {
    clearSelection();
    setSurfaceKey((value) => value + 1);
    hideMenu();
  }, [clearSelection, hideMenu]);

  const menu = useDesktopMenu(refreshDesktop);

  useWorldPublishers();
  useLostFilesDiscovery();
  useIcqEngine();
  const restoreSession = useSessionEngine();

  useEffect(() => {
    bootKernel();
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
      <AmbientLayer />
      <DesktopSurface onContextMenu={menu.onDesktop}>
        <DesktopIcons
          key={surfaceKey}
          onIconOpen={(icon) => openApp(icon.appId)}
          onIconContextMenu={menu.onIcon}
        />
      </DesktopSurface>
      <WindowHost />
      {balloonOpen && (
        <WelcomeBalloon
          onClose={() => setBalloonOpen(false)}
          onOpenApp={openFromBalloon}
        />
      )}
      <PixPet />
      <WorldEffects />
      <AchievementTracker />
      <AchievementBalloon />
      <LostFilesReveal />
      <RestoreSessionDialog onRestore={restoreSession} />
      <AgentNudge />
      <NotificationToast />
      <ContextMenu />
      <Taskbar />
    </div>
  );
}
