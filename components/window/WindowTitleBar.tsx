"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { WindowControls } from "@/components/window/WindowControls";
import { getApplication } from "@/core/process/app-registry";
import { cn } from "@/core/utils/cn";
import type { AppId } from "@/types/application";
import type { WindowId, WindowState } from "@/types/window";

const ACTIVE_GRADIENT =
  "linear-gradient(180deg, #0058ee 0%, #3593ff 4%, #288eff 6%, #127dff 8%, #036ffc 10%, #0262ee 14%, #0057e5 20%, #0054e3 24%, #0055eb 56%, #005bf5 66%, #026afe 76%, #0062ef 86%, #0052d6 92%, #0040ab 94%, #003092 100%)";

const INACTIVE_GRADIENT =
  "linear-gradient(180deg, #7697e7 0%, #a6badf 3%, #8da6dc 6%, #8da2d4 8%, #7f97d4 14%, #7d95d0 25%, #7b93cd 56%, #7f97d1 81%, #7b95cf 89%, #7396c3 94%, #6485b5 100%)";

interface WindowTitleBarProps {
  id: WindowId;
  appId: AppId;
  title: string;
  state: WindowState;
  focused: boolean;
  resizable: boolean;
  compact: boolean;
  onDragPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onToggleMaximize: () => void;
}

export function WindowTitleBar({
  id,
  appId,
  title,
  state,
  focused,
  resizable,
  compact,
  onDragPointerDown,
  onToggleMaximize,
}: WindowTitleBarProps) {
  const iconSrc = getApplication(appId)?.iconSrc;

  return (
    <div
      onPointerDown={onDragPointerDown}
      onDoubleClick={() => {
        if (resizable && !compact) onToggleMaximize();
      }}
      className="flex h-[28px] shrink-0 touch-none items-center gap-1.5 pr-1 pl-1.5 select-none"
      style={{ background: focused ? ACTIVE_GRADIENT : INACTIVE_GRADIENT }}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt=""
          width={16}
          height={16}
          unoptimized
          draggable={false}
        />
      )}
      <span
        className={cn(
          "flex-1 truncate text-[13px] font-bold",
          focused ? "text-white" : "text-white/85",
        )}
        style={{
          fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
          textShadow: "1px 1px 1px rgba(10, 24, 131, 0.7)",
        }}
      >
        {title}
      </span>
      <WindowControls
        id={id}
        state={state}
        resizable={resizable}
        showMaximize={!compact}
        onToggleMaximize={onToggleMaximize}
      />
    </div>
  );
}
