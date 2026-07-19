import { WallpaperFit, type Wallpaper } from "@/types/wallpaper";

export const DEFAULT_WALLPAPER: Wallpaper = {
  id: "tamirlan-hill",
  name: "Tamirlan Hill",
  src: "/assets/wallpapers/tamirlan-hill.jpg",
  fit: WallpaperFit.Cover,
};

// Hand-drawn stand-in shown until the photographic wallpaper file is added.
export const FALLBACK_WALLPAPER_SRC = "/assets/wallpapers/image.png";
