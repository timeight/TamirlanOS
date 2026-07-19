"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { ResizeDirection } from "@/core/window-manager/resize-bounds";
import { cn } from "@/core/utils/cn";

interface WindowResizeHandlesProps {
  onResizePointerDown: (
    direction: ResizeDirection,
  ) => (event: ReactPointerEvent<HTMLElement>) => void;
}

const HANDLES: readonly { direction: ResizeDirection; className: string }[] = [
  {
    direction: ResizeDirection.North,
    className: "top-0 right-2 left-2 h-1.5 cursor-ns-resize",
  },
  {
    direction: ResizeDirection.South,
    className: "right-2 bottom-0 left-2 h-1.5 cursor-ns-resize",
  },
  {
    direction: ResizeDirection.East,
    className: "top-2 right-0 bottom-2 w-1.5 cursor-ew-resize",
  },
  {
    direction: ResizeDirection.West,
    className: "top-2 bottom-2 left-0 w-1.5 cursor-ew-resize",
  },
  {
    direction: ResizeDirection.NorthEast,
    className: "top-0 right-0 h-2.5 w-2.5 cursor-nesw-resize",
  },
  {
    direction: ResizeDirection.NorthWest,
    className: "top-0 left-0 h-2.5 w-2.5 cursor-nwse-resize",
  },
  {
    direction: ResizeDirection.SouthEast,
    className: "right-0 bottom-0 h-2.5 w-2.5 cursor-nwse-resize",
  },
  {
    direction: ResizeDirection.SouthWest,
    className: "bottom-0 left-0 h-2.5 w-2.5 cursor-nesw-resize",
  },
];

export function WindowResizeHandles({
  onResizePointerDown,
}: WindowResizeHandlesProps) {
  return (
    <>
      {HANDLES.map(({ direction, className }) => (
        <div
          key={direction}
          aria-hidden="true"
          onPointerDown={onResizePointerDown(direction)}
          className={cn("absolute touch-none", className)}
        />
      ))}
    </>
  );
}
