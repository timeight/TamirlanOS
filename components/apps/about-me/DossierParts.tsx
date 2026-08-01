"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/core/utils/cn";

/** Reveals a block the first time it scrolls into the window's viewport. */
export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-[#1c2836] pb-2">
      <span className="font-mono text-[10px] text-[#3f5d78]">{index}</span>
      <h2 className="font-mono text-[12px] tracking-[0.34em] text-[#9fd8ff] uppercase">
        {title}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#1c2836] to-transparent" />
    </div>
  );
}

const CORNERS = [
  { place: "top-1.5 left-1.5", edges: "border-t border-l" },
  { place: "top-1.5 right-1.5", edges: "border-t border-r" },
  { place: "bottom-1.5 left-1.5", edges: "border-b border-l" },
  { place: "right-1.5 bottom-1.5", edges: "border-r border-b" },
] as const;

/** Framed slot that a real photograph can drop into without moving anything. */
export function PhotoSlot({
  label,
  caption,
  className,
  scanning = false,
}: {
  label: string;
  caption?: string;
  className?: string;
  scanning?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-[#22384c] bg-[#0a1119]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(#2f6f9e 1px, transparent 1px), linear-gradient(90deg, #2f6f9e 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {CORNERS.map((corner) => (
        <span
          key={corner.place}
          aria-hidden="true"
          className={cn(
            "absolute h-3 w-3 border-[#4d94c7]",
            corner.place,
            corner.edges,
          )}
        />
      ))}
      {scanning && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#5fd4ff]/22 to-transparent motion-safe:animate-[scan-sweep_3.4s_linear_infinite]"
        />
      )}
      <div className="relative flex h-full flex-col items-center justify-center px-3 py-6 text-center">
        <span className="font-mono text-[10px] tracking-[0.28em] text-[#5f8db0] uppercase">
          {label}
        </span>
        {caption && (
          <span className="mt-1 font-mono text-[9px] text-[#3f5d78]">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

/** Counts up once, then stops. Used for the HUD readouts. */
export function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
