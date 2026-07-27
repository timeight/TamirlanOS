import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";

interface CornerFrameProps {
  children: ReactNode;
  className?: string;
  accent?: string;
}

const CORNERS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

export function CornerFrame({
  children,
  className,
  accent = "#5fd4ff",
}: CornerFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn("pointer-events-none absolute h-2.5 w-2.5", corner)}
          style={{ borderColor: accent }}
        />
      ))}
      {children}
    </div>
  );
}
