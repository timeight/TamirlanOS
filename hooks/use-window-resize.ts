"use client";

import { useCallback, type PointerEvent as ReactPointerEvent } from "react";
import {
  resizeBounds,
  type ResizeDirection,
} from "@/core/window-manager/resize-bounds";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

export function useWindowResize(
  id: WindowId,
  frameRef: React.RefObject<HTMLElement | null>,
) {
  return useCallback(
    (direction: ResizeDirection) => (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      const frame = frameRef.current;
      const host = frame?.parentElement;
      if (!frame || !host) return;

      const window_ = useWindowStore.getState().windows[id];
      if (
        !window_ ||
        window_.state !== WindowState.Normal ||
        !window_.resizable
      ) {
        return;
      }

      const workArea = { width: host.clientWidth, height: host.clientHeight };
      const start = window_.bounds;
      const min = window_.minSize;
      const startX = event.clientX;
      const startY = event.clientY;
      let last = start;

      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      const onMove = (move: PointerEvent) => {
        const next = resizeBounds(
          start,
          direction,
          move.clientX - startX,
          move.clientY - startY,
          min,
          workArea,
        );
        last = next;
        frame.style.transform = `translate(${next.x}px, ${next.y}px)`;
        frame.style.width = `${next.width}px`;
        frame.style.height = `${next.height}px`;
      };

      const finish = (end: PointerEvent) => {
        handle.releasePointerCapture(end.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", finish);
        handle.removeEventListener("pointercancel", finish);
        useWindowStore.getState().resizeWindow(id, last);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", finish);
      handle.addEventListener("pointercancel", finish);
    },
    [id, frameRef],
  );
}
