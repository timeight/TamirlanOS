import type { Size } from "./geometry";

export type AppId = string;

export interface ApplicationManifest {
  id: AppId;
  title: string;
  iconSrc: string;
  defaultSize: Size;
  minSize: Size;
  resizable: boolean;
  singleton: boolean;
}
