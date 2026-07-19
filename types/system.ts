import type { BootStage } from "./boot";

export enum SystemPhase {
  Off = "off",
  Booting = "booting",
  Login = "login",
  Desktop = "desktop",
  ShuttingDown = "shutting-down",
}

export interface SystemState {
  phase: SystemPhase;
  bootStage: BootStage | null;
}
