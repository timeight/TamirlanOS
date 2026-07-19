import type { AppId } from "./application";

export interface GridSlot {
  column: number;
  row: number;
}

export interface DesktopIcon {
  id: string;
  appId: AppId;
  label: string;
  iconSrc: string;
  slot: GridSlot;
}
