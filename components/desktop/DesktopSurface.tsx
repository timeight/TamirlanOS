"use client";

import type { ReactNode } from "react";
import { useDesktopStore } from "@/stores/desktop-store";

interface DesktopSurfaceProps {
  children: ReactNode;
}

export function DesktopSurface({ children }: DesktopSurfaceProps) {
  const clearSelection = useDesktopStore((state) => state.clearSelection);

  return (
    <div className="absolute inset-0 bottom-[30px]" onClick={clearSelection}>
      {children}
    </div>
  );
}
