"use client";

import { cn } from "@/core/utils/cn";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";

interface WindowControlsProps {
  id: WindowId;
  state: WindowState;
  resizable: boolean;
  showMaximize: boolean;
  onToggleMaximize: () => void;
}

const BLUE_GRADIENT =
  "linear-gradient(180deg, #9db9ec 0%, #3a6cd8 45%, #2a52b8 100%)";

const RED_GRADIENT =
  "linear-gradient(180deg, #eeb2a2 0%, #d8674a 45%, #bb3b1d 100%)";

const buttonClass =
  "flex h-[21px] w-[21px] items-center justify-center rounded-[3px] border border-white/60 text-white shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4)] transition-[filter] duration-100 hover:brightness-110 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white disabled:opacity-50 disabled:hover:brightness-100 motion-reduce:transition-none";

export function WindowControls({
  id,
  state,
  resizable,
  showMaximize,
  onToggleMaximize,
}: WindowControlsProps) {
  const minimizeWindow = useWindowStore((store) => store.minimizeWindow);
  const closeWindow = useWindowStore((store) => store.closeWindow);
  const maximized = state === WindowState.Maximized;

  return (
    <div
      className="flex items-center gap-0.5"
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Minimize"
        onClick={() => minimizeWindow(id)}
        className={buttonClass}
        style={{ background: BLUE_GRADIENT }}
      >
        <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
          <path d="M1.5 8.5h5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      {showMaximize && (
        <button
          type="button"
          aria-label={maximized ? "Restore" : "Maximize"}
          disabled={!resizable}
          onClick={onToggleMaximize}
          className={buttonClass}
          style={{ background: BLUE_GRADIENT }}
        >
          {maximized ? (
            <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
              <path
                d="M3 3V1.5h5.5V7H7M1.5 3.5H7V9H1.5Z"
                fill="none"
                stroke="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
              <path
                d="M1.5 1.5h7v7h-7Zm0 1.5h7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      )}
      <button
        type="button"
        aria-label="Close"
        onClick={() => closeWindow(id)}
        className={cn(buttonClass, "ml-0.5")}
        style={{ background: RED_GRADIENT }}
      >
        <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2.5 w-2.5">
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
    </div>
  );
}
