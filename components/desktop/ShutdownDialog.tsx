"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/audio-store";
import { useSystemStore } from "@/stores/system-store";
import { SoundEvent } from "@/types/sound";

interface ShutdownDialogProps {
  onClose: () => void;
}

const optionClass =
  "group flex flex-col items-center gap-1.5 rounded-sm p-2 text-white focus-visible:bg-white/15 focus-visible:outline-none hover:bg-white/15";

export function ShutdownDialog({ onClose }: ShutdownDialogProps) {
  const shutDown = useSystemStore((state) => state.shutDown);
  const restart = useSystemStore((state) => state.restart);
  const logOff = useSystemStore((state) => state.logOff);
  const play = useAudioStore((state) => state.play);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const turnOff = () => {
    play(SoundEvent.Shutdown);
    shutDown();
  };
  const restartSystem = () => {
    play(SoundEvent.Shutdown);
    restart();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#00104d]/55">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Turn off computer"
        className="animate-fade-in w-[330px] overflow-hidden rounded-[6px] border border-[#0831d9] shadow-[3px_3px_12px_rgba(0,0,0,0.55)] motion-reduce:animate-none"
      >
        <div
          className="flex h-9 items-center px-3 text-[13px] font-bold text-white"
          style={{
            background:
              "linear-gradient(180deg, #0058ee 0%, #3593ff 6%, #0054e3 30%, #0055eb 70%, #003092 100%)",
            fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
            textShadow: "1px 1px 1px rgba(10, 24, 131, 0.7)",
          }}
        >
          Turn off computer
        </div>
        <div
          className="flex items-start justify-center gap-4 px-4 pt-5 pb-3"
          style={{
            background:
              "linear-gradient(180deg, #7a99e1 0%, #5f7fd0 55%, #4a69be 100%)",
          }}
        >
          <button
            ref={firstButtonRef}
            type="button"
            onClick={turnOff}
            className={optionClass}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #f08a6e, #c23417 70%)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v7" />
                <path d="M7.5 7.5a7 7 0 1 0 9 0" />
              </svg>
            </span>
            <span className="text-[11px]">Turn Off</span>
          </button>
          <button type="button" onClick={restartSystem} className={optionClass}>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #9fe07a, #2f8a1c 70%)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M19 12a7 7 0 1 1-3-5.7" />
                <path d="M16.5 2.5v4h-4" />
              </svg>
            </span>
            <span className="text-[11px]">Restart</span>
          </button>
          <button type="button" onClick={logOff} className={optionClass}>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #8fc0f5, #1c48b0 70%)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8.5" r="3.5" />
                <path d="M5.5 20c.8-4 3.5-6 6.5-6s5.7 2 6.5 6" />
              </svg>
            </span>
            <span className="text-[11px]">Log Off</span>
          </button>
        </div>
        <div
          className="flex justify-end px-3 py-2.5"
          style={{
            background: "linear-gradient(180deg, #4a69be 0%, #16307e 100%)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-4 py-0.5 text-[11px] text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
