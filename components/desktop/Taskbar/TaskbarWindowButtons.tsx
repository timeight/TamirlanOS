"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { getApplication } from "@/core/process/app-registry";
import { cn } from "@/core/utils/cn";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

export function TaskbarWindowButtons() {
  const windows = useWindowStore((state) => state.windows);
  const focusedId = useWindowStore((state) => state.focusedId);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);

  // XP behavior: unfocused raises, focused minimizes, minimized restores.
  const handleClick = (id: WindowId) => {
    const target = windows[id];
    if (!target) return;
    if (target.state === WindowState.Minimized) {
      restoreWindow(id);
    } else if (id === focusedId) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-1.5">
      {Object.values(windows).map((window) => {
        const pressed = window.id === focusedId;
        const iconSrc = getApplication(window.appId)?.iconSrc;
        return (
          <button
            key={window.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => handleClick(window.id)}
            className={cn(
              "flex h-[22px] w-40 min-w-0 shrink items-center gap-1.5 rounded-[3px] px-2 text-[11px] text-white transition-[filter] duration-100 hover:brightness-110 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white motion-reduce:transition-none",
            )}
            style={{
              background: pressed
                ? "linear-gradient(180deg, #1e52b7 0%, #1a48a5 50%, #2258bb 100%)"
                : "linear-gradient(180deg, #6ba1f0 0%, #3c81f3 12%, #2a6de0 75%, #2461ca 100%)",
              boxShadow: pressed
                ? "inset 1px 1px 2px rgba(0, 0, 0, 0.45)"
                : "inset 1px 1px 1px rgba(255, 255, 255, 0.4)",
            }}
          >
            {iconSrc && (
              <Image
                src={iconSrc}
                alt=""
                width={14}
                height={14}
                unoptimized
                draggable={false}
              />
            )}
            <span className="truncate">{window.title}</span>
          </button>
        );
      })}
    </div>
  );
}
