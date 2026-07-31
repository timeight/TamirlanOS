export interface DeviceRow {
  channel: string;
  device: string;
}

export const BIOS_VENDOR = "TamirlanOS Modular BIOS v1.0, An Energy Star Ally";
export const BIOS_COPYRIGHT = "Copyright (C) 2020-2026, Tamirlan Studio";
export const BIOS_ID = "07/31/2026-TMRL-OS-2026";

export const CPU_LINE = "Main Processor : Creative Core (R) 3.40GHz";
export const MEMORY_TOTAL_KB = 524288;

/** Counting in 16 MB steps keeps the memory test readable at ~2 seconds. */
export const MEMORY_STEP_KB = 16384;

export const DEVICE_ROWS: readonly DeviceRow[] = [
  { channel: "Primary Master", device: "TAMIRLANOS SSD 240GB" },
  { channel: "Primary Slave", device: "None" },
  { channel: "Secondary Master", device: "PORTFOLIO CD-ROM" },
  { channel: "Secondary Slave", device: "None" },
];

export const POST_LINES: readonly string[] = [
  "Detecting IDE drives ...",
  "Initializing USB Controllers .. Done",
  "Auto-Detecting Display Adapter ... OK",
  "Audio Device : Realistic AC'97 .. Enabled",
];

export function formatMemory(kb: number): string {
  return `${kb.toLocaleString("en-US")}K`;
}
