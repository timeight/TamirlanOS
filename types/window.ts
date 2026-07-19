import type { AppId } from "./application";
import type { Bounds, Size } from "./geometry";

export type WindowId = string;

export enum WindowState {
  Normal = "normal",
  Minimized = "minimized",
  Maximized = "maximized",
}

export interface WindowDescriptor {
  id: WindowId;
  appId: AppId;
  title: string;
  bounds: Bounds;
  restoreBounds: Bounds | null;
  state: WindowState;
  resizable: boolean;
  minSize: Size;
}
