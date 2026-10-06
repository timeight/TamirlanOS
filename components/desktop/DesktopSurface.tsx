"use client";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useDesktopStore } from "@/stores/desktop-store";

interface DesktopSurfaceProps {
  children: ReactNode;
  onContextMenu?: (event: ReactMouseEvent) => void;
}

export function DesktopSurface({
  children,
  onContextMenu,
}: DesktopSurfaceProps) {
  const clearSelection = useDesktopStore((state) => state.clearSelection);

  return (
    <div
      className="absolute inset-0 bottom-[30px]"
      onClick={clearSelection}
      onContextMenu={onContextMenu}
    >
      {children}
    </div>
  );
}
