"use client";

import { WindowManager } from "@/components/window/WindowManager";
import { useWindowStore } from "@/stores/window-store";

export function WindowHost() {
  const empty = useWindowStore((state) => state.zOrder.length === 0);

  if (empty) return null;

  return (
    <div className="pointer-events-none absolute inset-0 bottom-[30px] [&>*]:pointer-events-auto">
      <WindowManager />
    </div>
  );
}
