import { BootStage } from "@/types/boot";

export const BOOT_SEQUENCE: readonly BootStage[] = [
  BootStage.Bios,
  BootStage.Loading,
  BootStage.Welcome,
];

export const FIRST_BOOT_STAGE: BootStage = BootStage.Bios;

export function nextBootStage(stage: BootStage): BootStage | null {
  const index = BOOT_SEQUENCE.indexOf(stage);
  return BOOT_SEQUENCE[index + 1] ?? null;
}
