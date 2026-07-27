"use client";

import { FlyoutShell } from "@/components/desktop/StartMenu/FlyoutShell";
import { asset } from "@/core/config/base-path";
import { SOFTWARE_PROGRAMS } from "@/core/config/software";

interface SoftwareFlyoutProps {
  onClose: () => void;
}

export function SoftwareFlyout({ onClose }: SoftwareFlyoutProps) {
  return (
    <FlyoutShell title="Мои программы" side="top" onClose={onClose}>
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
    </FlyoutShell>
  );
}
