"use client";

import type { LoadPhase } from "@/stores/browser-store";
import { useT } from "@/hooks/use-translations";

interface IeStatusBarProps {
  phase: LoadPhase;
  url: string;
}

const PHASE_KEY: Record<LoadPhase, string> = {
  idle: "ie.status.done",
  opening: "ie.status.opening",
  connecting: "ie.status.connecting",
  loading: "ie.status.loading",
  done: "ie.status.done",
};

export function IeStatusBar({ phase, url }: IeStatusBarProps) {
  const t = useT();
  const busy = phase !== "done" && phase !== "idle";

  return (
    <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[#f6f4ec] bg-[#ece9d8] p-0.5 text-[10px] text-[#4a4a3a]">
      <span className="flex flex-1 items-center gap-1.5 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
        {busy && (
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#2f6f3d] motion-reduce:animate-none"
          />
        )}
        {t(PHASE_KEY[phase])}
      </span>
      <span className="hidden max-w-[45%] items-center gap-1 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)] @[420px]:flex">
        <LockIcon />
        {url}
      </span>
      <span className="border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
        {t("ie.zone")}
      </span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="h-2.5 w-2.5 shrink-0"
    >
      <rect
        x="2"
        y="5"
        width="8"
        height="6"
        rx="1"
        fill="#e8c15a"
        stroke="#8a6d3b"
        strokeWidth="0.7"
      />
      <path
        d="M4 5V3.6a2 2 0 0 1 4 0V5"
        fill="none"
        stroke="#8a6d3b"
        strokeWidth="1.1"
      />
    </svg>
  );
}
