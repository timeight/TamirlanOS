"use client";

import { memo, useRef } from "react";
import { AppRenderer } from "@/components/apps/AppRenderer";
import { WindowContent } from "@/components/window/WindowContent";
import { WindowResizeHandles } from "@/components/window/WindowResizeHandles";
import { WindowTitleBar } from "@/components/window/WindowTitleBar";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";
import { useWindowDrag } from "@/hooks/use-window-drag";
import { useWindowResize } from "@/hooks/use-window-resize";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

interface WindowFrameProps {
  id: WindowId;
  zIndex: number;
}

export const WindowFrame = memo(function WindowFrame({
  id,
  zIndex,
}: WindowFrameProps) {
  const window_ = useWindowStore((store) => store.windows[id]);
  const focused = useWindowStore((store) => store.focusedId === id);
  const focusWindow = useWindowStore((store) => store.focusWindow);
  const maximizeWindow = useWindowStore((store) => store.maximizeWindow);
  const restoreWindow = useWindowStore((store) => store.restoreWindow);

  const compact = useIsCompact();
  const frameRef = useRef<HTMLElement>(null);
  const onDragPointerDown = useWindowDrag(id, frameRef);
  const onResizePointerDown = useWindowResize(id, frameRef);

  if (!window_) return null;

  const maximized = window_.state === WindowState.Maximized;
  const noop = () => {};

  const toggleMaximize = () => {
    const host = frameRef.current?.parentElement;
    if (!host) return;
    if (maximized) {
      restoreWindow(id);
    } else {
      maximizeWindow(id, {
        width: host.clientWidth,
        height: host.clientHeight,
      });
    }
  };

  return (
    <section
      ref={frameRef}
      role="dialog"
      aria-label={window_.title}
      onPointerDownCapture={() => {
        if (!focused) focusWindow(id);
      }}
      style={
        compact
          ? {
              zIndex,
              background: focused ? "#0055e5" : "#7a96df",
              boxShadow: "none",
            }
          : {
              zIndex,
              width: window_.bounds.width,
              height: window_.bounds.height,
              transform: `translate(${window_.bounds.x}px, ${window_.bounds.y}px)`,
              background: focused ? "#0055e5" : "#7a96df",
              boxShadow: maximized ? "none" : "2px 2px 10px rgba(0, 0, 0, 0.5)",
            }
      }
      className={cn(
        "animate-fade-in absolute flex flex-col overflow-hidden motion-reduce:animate-none",
        compact
          ? "inset-0 rounded-none"
          : maximized
            ? "top-0 left-0 rounded-none"
            : "top-0 left-0 rounded-t-[8px]",
        window_.state === WindowState.Minimized && "hidden",
      )}
    >
      <WindowTitleBar
        id={id}
        appId={window_.appId}
        title={window_.title}
        state={window_.state}
        focused={focused}
        resizable={window_.resizable}
        compact={compact}
        onDragPointerDown={compact ? undefined : onDragPointerDown}
        onToggleMaximize={compact ? noop : toggleMaximize}
      />
      <div className="mx-[3px] mb-[3px] flex min-h-0 flex-1 flex-col">
        <WindowContent>
          <AppRenderer appId={window_.appId} />
        </WindowContent>
      </div>
      {!compact &&
        window_.resizable &&
        window_.state === WindowState.Normal && (
          <WindowResizeHandles onResizePointerDown={onResizePointerDown} />
        )}
    </section>
  );
});
