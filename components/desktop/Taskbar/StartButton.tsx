"use client";

import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/core/utils/cn";

interface StartButtonProps {
  open: boolean;
  onToggle: () => void;
}

export function StartButton({ open, onToggle }: StartButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        "flex h-full min-w-[98px] items-center gap-1.5 rounded-r-[12px] pr-5 pl-2.5 text-[18px] font-bold text-white italic transition-[filter] duration-100 hover:brightness-110 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white active:brightness-90 motion-reduce:transition-none",
        open && "brightness-90",
      )}
      style={{
        background:
          "linear-gradient(180deg, #7ede75 0%, #3fae3f 8%, #2f9e2f 50%, #268226 93%, #1d6a1d 100%)",
        boxShadow:
          "inset 1px 1px 1px rgba(255, 255, 255, 0.5), 2px 0 6px rgba(0, 0, 0, 0.35)",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
        fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
      }}
    >
      <BrandMark className="h-[17px] w-[17px]" />
      start
    </button>
  );
}
