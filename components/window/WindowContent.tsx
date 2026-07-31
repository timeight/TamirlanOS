"use client";

import type { ReactNode } from "react";
import { WindowMenuBar } from "@/components/window/WindowMenuBar";
import { WindowToolbar } from "@/components/window/WindowToolbar";
import { AppKey } from "@/core/apps/app-catalog";
import { getApplication } from "@/core/process/app-registry";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useWindowStore } from "@/stores/window-store";
import type { AppId } from "@/types/application";
import type { WindowId } from "@/types/window";

interface WindowContentProps {
  windowId: WindowId;
  appId: AppId;
  children?: ReactNode;
}

export function WindowContent({
  windowId,
  appId,
  children,
}: WindowContentProps) {
  const closeWindow = useWindowStore((store) => store.closeWindow);
  const openApp = useOpenApp();
  const t = useT();
  const manifest = getApplication(appId);
  const iconSrc = manifest?.iconSrc;

  if (manifest?.chrome === false) {
    return (
      <div className="@container min-h-0 flex-1 overflow-hidden bg-white text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--os-face)]">
      <WindowMenuBar
        onClose={() => closeWindow(windowId)}
        onAbout={() => openApp(AppKey.Welcome)}
      />
      <WindowToolbar iconSrc={iconSrc} title={t(`app.${appId}`)} />
      <div className="@container min-h-0 flex-1 overflow-auto bg-white text-slate-900">
        {children}
      </div>
      <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[var(--os-frame-light)] bg-[var(--os-face)] p-0.5 text-[11px] text-[var(--os-text-secondary)]">
        <span className="flex-1 border border-[var(--os-inset-border)] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {t("win.done")}
        </span>
        <span className="w-28 border border-[var(--os-inset-border)] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]" />
      </div>
    </div>
  );
}
