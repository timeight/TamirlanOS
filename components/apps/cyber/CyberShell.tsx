import type { ReactNode } from "react";
import { GlitchHeading } from "@/components/ui/GlitchHeading";

interface CyberShellProps {
  heading: string;
  section: string;
  children: ReactNode;
}

const GRID =
  "linear-gradient(rgba(95,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(95,212,255,0.05) 1px, transparent 1px)";

export function CyberShell({ heading, section, children }: CyberShellProps) {
  return (
    <div className="bg-cyber-bg @container relative h-full overflow-auto font-mono text-slate-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: GRID, backgroundSize: "38px 38px" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-3 hidden text-[10px] tracking-[0.3em] text-slate-600 @[520px]:block"
        style={{ writingMode: "vertical-rl" }}
      >
        七転び八起き · TAMIRLAN — ZHAMALOV
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-3 hidden text-[9px] tracking-[0.35em] text-slate-600 @[520px]:block"
        style={{ writingMode: "vertical-rl" }}
      >
        {section}
      </span>
      <div className="relative z-10 mx-auto max-w-[660px] px-5 py-8 @[520px]:px-10">
        <div className="mb-7 text-center">
          <GlitchHeading
            text={heading}
            className="text-2xl @[520px]:text-3xl"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
