"use client";

interface BrandMarkProps {
  className?: string;
}

// One waving pane, reused four times: left edge dips, right edge lifts, like cloth in wind.
const PANE = "M0 4 Q 5 0 10 1 Q 15 2 20 0 L 20 14 Q 15 16 10 15 Q 5 14 0 18 Z";

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="pane-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a5e" />
          <stop offset="1" stopColor="#dd4408" />
        </linearGradient>
        <linearGradient id="pane-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b2e468" />
          <stop offset="1" stopColor="#5f9c14" />
        </linearGradient>
        <linearGradient id="pane-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cc6f8" />
          <stop offset="1" stopColor="#0a6fcc" />
        </linearGradient>
        <linearGradient id="pane-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffdd6b" />
          <stop offset="1" stopColor="#e39a0c" />
        </linearGradient>
        <linearGradient id="pane-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="rotate(-4 24 24)">
        <g transform="translate(3 8)">
          <path d={PANE} fill="url(#pane-red)" />
          <path d={PANE} fill="url(#pane-gloss)" />
        </g>
        <g transform="translate(25 4)">
          <path d={PANE} fill="url(#pane-green)" />
          <path d={PANE} fill="url(#pane-gloss)" />
        </g>
        <g transform="translate(3 28)">
          <path d={PANE} fill="url(#pane-blue)" />
          <path d={PANE} fill="url(#pane-gloss)" />
        </g>
        <g transform="translate(25 24)">
          <path d={PANE} fill="url(#pane-yellow)" />
          <path d={PANE} fill="url(#pane-gloss)" />
        </g>
      </g>
    </svg>
  );
}
