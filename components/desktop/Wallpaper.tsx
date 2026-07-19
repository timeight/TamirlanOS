"use client";

import { asset } from "@/core/config/base-path";
import { FALLBACK_WALLPAPER_SRC } from "@/core/wallpaper/wallpapers";
import { wallpaperStyle } from "@/core/wallpaper/wallpaper-style";
import { useDesktopStore } from "@/stores/desktop-store";

export function Wallpaper() {
  const wallpaper = useDesktopStore((state) => state.wallpaper);
  const style = wallpaperStyle(wallpaper);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        ...style,
        // Layered so a missing photo file gracefully reveals the drawn fallback.
        backgroundImage: `${style.backgroundImage}, url(${asset(FALLBACK_WALLPAPER_SRC)})`,
        backgroundSize: `${style.backgroundSize}, cover`,
        backgroundPosition: `${style.backgroundPosition}, center`,
        backgroundRepeat: `${style.backgroundRepeat}, no-repeat`,
      }}
    />
  );
}
