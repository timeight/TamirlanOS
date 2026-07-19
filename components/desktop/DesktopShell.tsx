"use client";

import { useEffect, useState } from "react";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { DesktopSurface } from "@/components/desktop/DesktopSurface";
import { Taskbar } from "@/components/desktop/Taskbar/Taskbar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WelcomeBalloon } from "@/components/desktop/WelcomeBalloon";
import { WindowHost } from "@/components/desktop/WindowHost";
import { installApps, type AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";

export function DesktopShell() {
  const openApp = useOpenApp();
  const [balloonOpen, setBalloonOpen] = useState(true);

  useEffect(() => {
    installApps();
  }, []);

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
