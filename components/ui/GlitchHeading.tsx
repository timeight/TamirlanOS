import { cn } from "@/core/utils/cn";

interface GlitchHeadingProps {
  text: string;
  className?: string;
}

export function GlitchHeading({ text, className }: GlitchHeadingProps) {
  return (
    <span
      className={cn(
        "motion-safe:hover:animate-glitch relative inline-block font-mono font-bold tracking-[0.14em] text-slate-100 uppercase",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-cyber-cyan absolute inset-0 translate-x-[-2px] opacity-70"
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="text-cyber-lime absolute inset-0 translate-x-[2px] opacity-70"
      >
        {text}
      </span>
      <span className="relative">{text}</span>
    </span>
  );
}
