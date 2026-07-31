export interface PetSkin {
  id: string;
  nameKey: string;
  body: string;
  bodyDark: string;
  panel: string;
  accent: string;
  eye: string;
  antenna: string;
  outline: string;
  /** Friendship needed to unlock. 0 means available from the first visit. */
  unlockAt: number;
}

/** Adding a skin is data only — no logic anywhere else changes. */
export const PET_SKINS: readonly PetSkin[] = [
  {
    id: "default",
    nameKey: "pix.skin.default",
    body: "#dceaf7",
    bodyDark: "#a9c9e8",
    panel: "#2f7fd4",
    accent: "#1a56b8",
    eye: "#123a63",
    antenna: "#5fd4ff",
    outline: "#1a4a86",
    unlockAt: 0,
  },
  {
    id: "prototype",
    nameKey: "pix.skin.prototype",
    body: "#e8e5d8",
    bodyDark: "#c3bfa8",
    panel: "#8a8676",
    accent: "#5f5e5a",
    eye: "#2c2c2a",
    antenna: "#f2c14e",
    outline: "#5f5e5a",
    unlockAt: 15,
  },
  {
    id: "retro",
    nameKey: "pix.skin.retro",
    body: "#f4f0e2",
    bodyDark: "#d8d0b4",
    panel: "#2f8a1c",
    accent: "#1d5c12",
    eye: "#153c0d",
    antenna: "#c6f24e",
    outline: "#4a4a3a",
    unlockAt: 30,
  },
  {
    id: "pixel",
    nameKey: "pix.skin.pixel",
    body: "#cfe6fb",
    bodyDark: "#8fbde4",
    panel: "#316ac5",
    accent: "#0831d9",
    eye: "#04204a",
    antenna: "#ffffff",
    outline: "#0831d9",
    unlockAt: 45,
  },
  {
    id: "ghost",
    nameKey: "pix.skin.ghost",
    body: "#eef4ff",
    bodyDark: "#c4d3ea",
    panel: "#8fa8d4",
    accent: "#6b82ab",
    eye: "#3d4f6e",
    antenna: "#dbe7ff",
    outline: "#8fa8d4",
    unlockAt: 60,
  },
  {
    id: "cyber",
    nameKey: "pix.skin.cyber",
    body: "#12203a",
    bodyDark: "#0a1424",
    panel: "#5fd4ff",
    accent: "#c6f24e",
    eye: "#c6f24e",
    antenna: "#5fd4ff",
    outline: "#5fd4ff",
    unlockAt: 75,
  },
  {
    id: "developer",
    nameKey: "pix.skin.developer",
    body: "#1e1e1e",
    bodyDark: "#141414",
    panel: "#4ec9b0",
    accent: "#569cd6",
    eye: "#dcdcaa",
    antenna: "#c586c0",
    outline: "#4ec9b0",
    unlockAt: 90,
  },
  {
    id: "golden",
    nameKey: "pix.skin.golden",
    body: "#ffe9a8",
    bodyDark: "#e8b93f",
    panel: "#c98f1f",
    accent: "#8a5a08",
    eye: "#5a3c06",
    antenna: "#fff5cf",
    outline: "#8a5a08",
    unlockAt: 100,
  },
];

export const DEFAULT_SKIN = PET_SKINS[0]!;

export function findSkin(id: string): PetSkin {
  return PET_SKINS.find((skin) => skin.id === id) ?? DEFAULT_SKIN;
}

export function unlockedSkins(friendship: number): readonly PetSkin[] {
  return PET_SKINS.filter((skin) => friendship >= skin.unlockAt);
}
