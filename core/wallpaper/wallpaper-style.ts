import { asset } from "@/core/config/base-path";
import { WallpaperFit, type Wallpaper } from "@/types/wallpaper";

export interface WallpaperStyle {
  backgroundImage: string;
  backgroundSize: string;
  backgroundRepeat: string;
  backgroundPosition: string;
}

const fitStyles: Readonly<
  Record<WallpaperFit, Omit<WallpaperStyle, "backgroundImage">>
> = {
  [WallpaperFit.Center]: {
    backgroundSize: "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  [WallpaperFit.Tile]: {
    backgroundSize: "auto",
    backgroundRepeat: "repeat",
    backgroundPosition: "top left",
  },
  [WallpaperFit.Stretch]: {
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  [WallpaperFit.Cover]: {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
};

export function wallpaperStyle(wallpaper: Wallpaper): WallpaperStyle {
  return {
    backgroundImage: `url(${asset(wallpaper.src)})`,
    ...fitStyles[wallpaper.fit],
  };
}
