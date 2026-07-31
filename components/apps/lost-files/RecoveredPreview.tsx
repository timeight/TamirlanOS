import type { RecoveryTint } from "@/core/lost-files/archive";

interface RecoveredPreviewProps {
  seed: number;
  tint: RecoveryTint;
}

const PALETTE: Record<RecoveryTint, readonly [string, string, string]> = {
  warm: ["#3a2a1f", "#c98c4a", "#f0d2a4"],
  cool: ["#1d2735", "#4a7fb5", "#c3ddf2"],
  mono: ["#232323", "#6f6f6f", "#d8d8d8"],
  green: ["#16241b", "#4f8f5c", "#bfe0c4"],
};

/** Deterministic pseudo-random so a file looks the same on every visit. */
function next(state: number): number {
  return (state * 1103515245 + 12345) % 2147483648;
}

/**
 * Files this old have no surviving asset. Rather than fake a photograph, the
 * viewer shows what a partial recovery actually looks like: bands of colour
 * where the data still parses and gaps where it does not.
 */
export function RecoveredPreview({ seed, tint }: RecoveredPreviewProps) {
  const [dark, mid, light] = PALETTE[tint];
  const bands: { y: number; h: number; fill: string; o: number }[] = [];
  let state = next(seed * 7919);
  let y = 0;
  while (y < 100) {
    const h = 2 + (state % 9);
    state = next(state);
    const pick = state % 10;
    state = next(state);
    bands.push({
      y,
      h,
      fill: pick < 5 ? mid : pick < 8 ? light : dark,
      o: pick === 9 ? 0.12 : 0.45 + (state % 50) / 100,
    });
    y += h;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <rect width="100" height="100" fill={dark} />
      {bands.map((band) => (
        <rect
          key={band.y}
          x="0"
          y={band.y}
          width="100"
          height={band.h}
          fill={band.fill}
          opacity={band.o}
        />
      ))}
      <rect
        x="0"
        y={62 + (seed % 12)}
        width="100"
        height="7"
        fill={dark}
        opacity="0.85"
      />
    </svg>
  );
}
