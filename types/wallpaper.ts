export enum WallpaperFit {
  Center = "center",
  Tile = "tile",
  Stretch = "stretch",
  Cover = "cover",
}

export interface Wallpaper {
  id: string;
  name: string;
  src: string;
  fit: WallpaperFit;
}
