import { cn } from "@/core/utils/cn";

interface DiscardedIconProps {
  kind: "project" | "logo" | "prototype" | "experiment";
  className?: string;
}

const GLYPHS: Record<DiscardedIconProps["kind"], { path: string; bg: string }> =
  {
    project: {
      path: "M4 7.5h6l2 2.5h12V22H4Z",
      bg: "#e8c15a",
    },
    logo: {
      path: "M14 4.5 22 12l-8 7.5L6 12Z",
      bg: "#b98ae0",
    },
    prototype: {
      path: "M9 4h10l4 4v16H9Zm10 0v4h4M13 13h8M13 17h6",
      bg: "#7fb2e5",
    },
    experiment: {
      path: "M11 3v7L5 21h18l-6-11V3M9.5 3h9M9 15h10",
      bg: "#7cc48a",
    },
  };

export function DiscardedIcon({ kind, className }: DiscardedIconProps) {
  const glyph = GLYPHS[kind];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[4px] border border-black/15",
        className,
      )}
      style={{ background: glyph.bg }}
    >
      <svg
        viewBox="0 0 28 26"
        aria-hidden="true"
        className="h-[64%] w-[64%]"
        fill="none"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d={glyph.path} />
      </svg>
    </span>
  );
}
