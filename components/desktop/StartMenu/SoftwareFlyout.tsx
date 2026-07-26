"use client";

import { asset } from "@/core/config/base-path";
import { SOFTWARE_PROGRAMS } from "@/core/config/software";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";

export function SoftwareFlyout() {
  const compact = useIsCompact();

  return (
    <div
      role="menu"
      aria-label="Мои программы"
      className={cn(
        "z-30 overflow-auto rounded-sm border border-[#8a8676] bg-white py-1 shadow-[3px_3px_10px_rgba(0,0,0,0.4)]",
        compact
          ? "absolute inset-0 w-full"
          : "absolute top-0 left-full ml-0.5 max-h-[70vh] w-[210px]",
      )}
    >
      {SOFTWARE_PROGRAMS.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-2 px-2 py-1 text-[11px] text-black"
        >
          {item.icon ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(item.icon)}
                alt=""
                draggable={false}
                className="max-h-5 max-w-5 object-contain"
              />
            </span>
          ) : (
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] text-[9px] font-bold"
              style={{ background: item.bg, color: item.fg }}
            >
              {item.short}
            </span>
          )}
          <span className="truncate">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
