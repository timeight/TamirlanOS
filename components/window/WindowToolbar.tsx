"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useT } from "@/hooks/use-translations";

interface WindowToolbarProps {
  iconSrc?: string;
  title: string;
}

// Navigation is a visual homage: windows have no history, so the buttons read as
// authentically disabled rather than pretending to work.
const navButton =
  "flex items-center gap-1 rounded-sm px-2 py-1 text-[var(--os-text-disabled)]";

export function WindowToolbar({ iconSrc, title }: WindowToolbarProps) {
  const t = useT();
  return (
    <>
      <div className="flex shrink-0 items-center gap-0.5 border-b border-[var(--os-frame)] bg-gradient-to-b from-[#faf9f4] to-[#e7e4d3] px-1.5 py-1 text-[11px]">
        <span className={navButton} aria-disabled="true">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M10 3 5 8l5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("win.back")}
        </span>
        <span
          className={navButton}
          aria-disabled="true"
          aria-label={t("win.forward")}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M6 3l5 5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="mx-1 h-5 w-px bg-[var(--os-inset-border)]" />
        <span
          className={navButton}
          aria-disabled="true"
          aria-label={t("win.up")}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M3 10l5-5 5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 border-b border-[var(--os-frame)] bg-[var(--os-face)] px-2 py-1 text-[11px] text-black">
        <span className="text-[var(--os-text-secondary)]">
          {t("win.address")}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 border border-[var(--os-field-border)] bg-white px-1.5 py-0.5">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt=""
              width={14}
              height={14}
              unoptimized
              draggable={false}
            />
          )}
          <span className="truncate">{title}</span>
        </div>
        <span
          aria-disabled="true"
          className="rounded-sm border border-[var(--os-frame)] bg-gradient-to-b from-white to-[#e7e4d3] px-2 py-0.5 text-[var(--os-text-disabled)]"
        >
          {t("win.go")}
        </span>
      </div>
    </>
  );
}
