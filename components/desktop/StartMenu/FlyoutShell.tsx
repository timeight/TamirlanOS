"use client";

import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";

interface FlyoutShellProps {
  title: string;
  side: "top" | "bottom";
  onClose: () => void;
  children: ReactNode;
}

export function FlyoutShell({
  title,
  side,
  onClose,
  children,
}: FlyoutShellProps) {
  const compact = useIsCompact();

  return (
    <div
      role="menu"
      aria-label={title}
      className={cn(
        "z-30 overflow-auto border border-[var(--os-menu-border)] bg-white shadow-[3px_3px_10px_rgba(0,0,0,0.4)]",
        compact
          ? "fixed bottom-[34px] left-2 max-h-[70vh] w-[min(280px,86vw)] rounded-sm"
          : cn(
              "absolute left-full ml-0.5 max-h-[70vh] w-[220px] rounded-sm",
              side === "top" ? "top-0" : "bottom-0",
            ),
      )}
    >
      {compact && (
        <button
          type="button"
          onClick={onClose}
          className="hover:bg-xp-selection sticky top-0 z-10 flex w-full items-center gap-2 border-b border-[#c8c4b4] bg-[var(--os-face)] px-3 py-2 text-left text-[12px] font-bold hover:text-white"
        >
          <span aria-hidden="true">◀</span> {title}
        </button>
      )}
      <div className="py-1">{children}</div>
    </div>
  );
}
