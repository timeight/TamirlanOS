"use client";

import { useEffect, useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { cn } from "@/core/utils/cn";

interface ProfilePortraitProps {
  /** Drop a real photo in here later; the frame never changes. */
  src?: string;
  label?: string;
  signature?: string;
}

const GLITCH_MIN_MS = 20_000;
const GLITCH_MAX_MS = 40_000;

export function ProfilePortrait({
  src,
  label = "YOUR PHOTO HERE",
  signature = "Create. Learn. Inspire.",
}: ProfilePortraitProps) {
  const [glitching, setGlitching] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [verified, setVerified] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const schedule = () => {
      const wait =
        GLITCH_MIN_MS + Math.random() * (GLITCH_MAX_MS - GLITCH_MIN_MS);
      timer.current = window.setTimeout(() => {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 300);
        schedule();
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <figure
      onMouseEnter={() => setScanKey((key) => key + 1)}
      onDoubleClick={() => setVerified(true)}
      className="relative w-full max-w-[300px] rotate-[1.2deg] bg-[#efece3] p-2 pb-8 shadow-[0_10px_28px_rgba(0,0,0,0.6)]"
    >
      <span
        aria-hidden="true"
        className="absolute -top-3 -left-4 h-6 w-20 -rotate-6 bg-white/22 shadow-[0_1px_3px_rgba(0,0,0,0.35)] backdrop-blur-[1px]"
      />
      <span
        aria-hidden="true"
        className="absolute -top-2 -right-5 h-6 w-20 rotate-[8deg] bg-white/22 shadow-[0_1px_3px_rgba(0,0,0,0.35)] backdrop-blur-[1px]"
      />

      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-[#0a1119]",
          glitching && "motion-safe:animate-[glitch_180ms_steps(2,end)_2]",
        )}
      >
        {src ? (
          <AssetImage
            src={src}
            alt=""
            fill
            unoptimized
            draggable={false}
            className="object-cover"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#2f6f9e 1px, transparent 1px), linear-gradient(90deg, #2f6f9e 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-[10px] tracking-[0.24em] text-[#5f8db0]">
              {label}
            </span>
          </>
        )}

        <span
          key={scanKey}
          aria-hidden="true"
          className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[#5fd4ff]/28 to-transparent motion-safe:animate-[scan-sweep_4.2s_linear_infinite]"
        />
        {glitching && (
          <>
            <span className="absolute inset-0 translate-x-[2px] bg-[#ff004c] opacity-30 mix-blend-screen" />
            <span className="absolute inset-0 -translate-x-[2px] bg-[#00e5ff] opacity-30 mix-blend-screen" />
          </>
        )}
      </div>

      <figcaption className="absolute right-4 bottom-1.5 left-3 flex items-end justify-between">
        <span className="font-serif text-[13px] text-[#3a3a3a] italic">
          {signature}
        </span>
        {verified && (
          <span className="font-mono text-[8px] tracking-[0.16em] text-[#2f8a4f]">
            IDENTITY VERIFIED
          </span>
        )}
      </figcaption>
    </figure>
  );
}
