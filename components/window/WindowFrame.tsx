"use client";

import { memo, useCallback, useRef } from "react";
import { AppRenderer } from "@/components/apps/AppRenderer";
import { WindowContent } from "@/components/window/WindowContent";
import { WindowResizeHandles } from "@/components/window/WindowResizeHandles";
import { WindowTitleBar } from "@/components/window/WindowTitleBar";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";
import { useWindowDrag } from "@/hooks/use-window-drag";
import { useWindowResize } from "@/hooks/use-window-resize";
import {
  useWindowTransition,
  type WindowPhase,
} from "@/hooks/use-window-transition";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

/** Minimize and restore pull toward the bottom-left, where the taskbar lives. */
const PHASE_CLASS: Record<WindowPhase, string> = {
  opening: "animate-window-open",
  idle: "",
  minimizing: "animate-window-minimize origin-bottom-left",
  restoring: "animate-window-restore origin-bottom-left",
  hidden: "hidden",
  closing: "animate-window-close pointer-events-none",
};

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
  const destroyWindow = useWindowStore((store) => store.destroyWindow);
  const closing = useWindowStore((store) => store.closing.includes(id));

  const compact = useIsCompact();
  const frameRef = useRef<HTMLElement>(null);
  const onDragPointerDown = useWindowDrag(id, frameRef);
  const onResizePointerDown = useWindowResize(id, frameRef);
  const onClosed = useCallback(() => destroyWindow(id), [destroyWindow, id]);
  const phase = useWindowTransition(
    window_?.state ?? WindowState.Normal,
    closing,
    onClosed,
  );

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
              background: focused
                ? "var(--os-accent)"
                : "var(--os-titlebar-inactive-from)",
              boxShadow: "none",
            }
          : {
              zIndex,
              width: window_.bounds.width,
              height: window_.bounds.height,
              translate: `${window_.bounds.x}px ${window_.bounds.y}px`,
              background: focused
                ? "var(--os-accent)"
                : "var(--os-titlebar-inactive-from)",
              boxShadow: maximized
                ? "none"
                : focused
                  ? "3px 4px 14px rgba(0, 0, 0, 0.55)"
                  : "2px 2px 7px rgba(0, 0, 0, 0.35)",
            }
      }
      className={cn(
        "absolute flex flex-col overflow-hidden motion-reduce:animate-none",
        compact
          ? "inset-0 rounded-none"
          : maximized
            ? "top-0 left-0 rounded-none"
            : "top-0 left-0 rounded-t-[8px]",
        PHASE_CLASS[phase],
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
        <WindowContent windowId={id} appId={window_.appId}>
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
