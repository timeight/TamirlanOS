"use client";

import { useDesktopStore } from "@/stores/desktop-store";

// A fine aperture-grille pattern: faint horizontal scanlines plus an even
// fainter vertical pixel grid, with a soft vignette toward the corners.
const CRT_PATTERN =
  "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.11) 0px, rgba(0, 0, 0, 0.11) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, transparent 62%, rgba(0, 10, 40, 0.2) 100%)";

export function CrtOverlay() {
  const enabled = useDesktopStore((state) => state.crtEnabled);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ background: CRT_PATTERN }}
    />
  );
}
