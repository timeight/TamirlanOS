"use client";

import { useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { clampToWorkArea } from "@/core/window-manager/window-geometry";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

const DRAG_THRESHOLD_PX = 3;

export function useWindowDrag(
  id: WindowId,
  frameRef: React.RefObject<HTMLElement | null>,
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      const frame = frameRef.current;
      const host = frame?.parentElement;
      if (!frame || !host) return;

      const window_ = useWindowStore.getState().windows[id];
      if (!window_ || window_.state === WindowState.Minimized) return;

      // Measure once at gesture start; pointer-move handlers must not read layout.
      const workArea = { width: host.clientWidth, height: host.clientHeight };
      const startX = event.clientX;
      const startY = event.clientY;
      let base = window_.bounds;
      let last = base;
      let dragging = false;
      let maximized = window_.state === WindowState.Maximized;

      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      const onMove = (move: PointerEvent) => {
        const dx = move.clientX - startX;
        const dy = move.clientY - startY;

        if (!dragging) {
          if (
            Math.abs(dx) < DRAG_THRESHOLD_PX &&
            Math.abs(dy) < DRAG_THRESHOLD_PX
          ) {
            return;
          }
          dragging = true;
          if (maximized) {
            // Tear-off: restore under the cursor, keeping the grip point proportional.
            useWindowStore.getState().restoreWindow(id);
            const restored = useWindowStore.getState().windows[id];
            if (!restored) return;
            base = {
              ...restored.bounds,
              x: startX - restored.bounds.width * (startX / workArea.width),
              y: 0,
            };
            maximized = false;
          }
        }

        const next = clampToWorkArea(
          { ...base, x: base.x + dx, y: base.y + dy },
          workArea,
        );
        last = next;
        frame.style.transform = `translate(${next.x}px, ${next.y}px)`;
      };

      const finish = (end: PointerEvent) => {
        handle.releasePointerCapture(end.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", finish);
        handle.removeEventListener("pointercancel", finish);
        if (dragging) {
          useWindowStore.getState().moveWindow(id, { x: last.x, y: last.y });
        }
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", finish);
      handle.addEventListener("pointercancel", finish);
    },
    [id, frameRef],
  );
}
