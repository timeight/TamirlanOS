import { createToken, type Manager } from "@/core/kernel/manager";
import { resolve } from "@/core/kernel/service-registry";
import { SETTINGS_MANAGER } from "@/core/system/settings-manager";

/** Every colour token a theme must supply. Metrics and motion are global. */
export interface ThemeColors {
  face: string;
  faceLight: string;
  faceDark: string;
  frame: string;
  frameLight: string;
  insetBorder: string;

  titlebarActiveFrom: string;
  titlebarActiveMid: string;
  titlebarActiveTo: string;
  titlebarInactiveFrom: string;
  titlebarInactiveTo: string;
  titlebarText: string;
  titlebarAccent: string;

  windowBackground: string;
  windowBorder: string;
  windowContentText: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textHeading: string;
  textDisabled: string;
  textOnAccent: string;

  selection: string;
  selectionText: string;
  hover: string;
  hoverSoft: string;
  menuBorder: string;
  fieldBorder: string;
  fieldBackground: string;

  taskbarFrom: string;
  taskbarTo: string;
  taskbarText: string;
  startFrom: string;
  startTo: string;
  startText: string;

  balloonBackground: string;
  balloonBorder: string;
  balloonText: string;

  accent: string;
  danger: string;
  success: string;
  warning: string;
  link: string;
  linkHover: string;

  wallpaperOverlay: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

const LUNA: ThemeColors = {
  face: "#ece9d8",
  faceLight: "#f7f5ec",
  faceDark: "#d4d0c8",
  frame: "#aca899",
  frameLight: "#f6f4ec",
  insetBorder: "#c3bfa8",
  titlebarActiveFrom: "#1c68d8",
  titlebarActiveMid: "#3f8cf3",
  titlebarActiveTo: "#1044a5",
  titlebarInactiveFrom: "#7a96df",
  titlebarInactiveTo: "#6a85c9",
  titlebarText: "#ffffff",
  titlebarAccent: "#f0a63c",
  windowBackground: "#ffffff",
  windowBorder: "#0831d9",
  windowContentText: "#000000",
  textPrimary: "#000000",
  textSecondary: "#4a5a70",
  textMuted: "#7a8390",
  textHeading: "#003399",
  textDisabled: "#9aa0a6",
  textOnAccent: "#ffffff",
  selection: "#316ac5",
  selectionText: "#ffffff",
  hover: "#d6e6f8",
  hoverSoft: "#ebf3fb",
  menuBorder: "#8a8676",
  fieldBorder: "#7f9db9",
  fieldBackground: "#ffffff",
  taskbarFrom: "#2b6cd8",
  taskbarTo: "#1b4ba8",
  taskbarText: "#ffffff",
  startFrom: "#3faa3c",
  startTo: "#217a1e",
  startText: "#ffffff",
  balloonBackground: "#ffffe1",
  balloonBorder: "#767676",
  balloonText: "#000000",
  accent: "#0055e5",
  danger: "#c0392b",
  success: "#2f8a1c",
  warning: "#f2c14e",
  link: "#0000ee",
  linkHover: "#cc0000",
  wallpaperOverlay: "rgb(0 0 0 / 0)",
};

const CLASSIC: ThemeColors = {
  ...LUNA,
  face: "#d4d0c8",
  faceLight: "#e8e4dc",
  faceDark: "#bdb8ad",
  frame: "#808080",
  frameLight: "#ffffff",
  insetBorder: "#9a9a9a",
  titlebarActiveFrom: "#000080",
  titlebarActiveMid: "#1084d0",
  titlebarActiveTo: "#000080",
  titlebarInactiveFrom: "#808080",
  titlebarInactiveTo: "#a0a0a0",
  titlebarAccent: "#c0c0c0",
  windowBorder: "#404040",
  hover: "#c8c4bc",
  hoverSoft: "#e0dcd4",
  menuBorder: "#808080",
  fieldBorder: "#808080",
  taskbarFrom: "#d4d0c8",
  taskbarTo: "#bdb8ad",
  taskbarText: "#000000",
  startFrom: "#d4d0c8",
  startTo: "#bdb8ad",
  startText: "#000000",
  selection: "#000080",
  textHeading: "#000080",
  accent: "#000080",
};

const DARK_XP: ThemeColors = {
  ...LUNA,
  face: "#20232b",
  faceLight: "#2a2e38",
  faceDark: "#171a21",
  frame: "#3a4152",
  frameLight: "#2f3542",
  insetBorder: "#3a4152",
  titlebarActiveFrom: "#1b2740",
  titlebarActiveMid: "#2f4468",
  titlebarActiveTo: "#0c1422",
  titlebarInactiveFrom: "#242a36",
  titlebarInactiveTo: "#1a1f28",
  titlebarAccent: "#5fd4ff",
  windowBackground: "#20232b",
  windowBorder: "#3a4152",
  windowContentText: "#e2e8f0",
  textPrimary: "#e2e8f0",
  textSecondary: "#9aa8bd",
  textMuted: "#6b7785",
  textHeading: "#7fc3ff",
  textDisabled: "#5a6270",
  selection: "#2f6fd0",
  hover: "#2c3444",
  hoverSoft: "#252b37",
  menuBorder: "#3a4152",
  fieldBorder: "#3a4152",
  fieldBackground: "#171a21",
  taskbarFrom: "#1b2740",
  taskbarTo: "#0a1020",
  startFrom: "#2f6f3d",
  startTo: "#1d4a27",
  balloonBackground: "#2a2e38",
  balloonBorder: "#4a5162",
  balloonText: "#e2e8f0",
  link: "#7fc3ff",
  linkHover: "#a9d8ff",
  wallpaperOverlay: "rgb(0 0 0 / 0.35)",
};

export const THEMES: readonly Theme[] = [
  { id: "luna", name: "Windows XP Luna", colors: LUNA },
  { id: "classic", name: "Windows Classic", colors: CLASSIC },
  { id: "dark-xp", name: "Dark XP", colors: DARK_XP },
];

/** Maps a colour key to the CSS custom property components read. */
const CSS_VARIABLE: Record<keyof ThemeColors, string> = {
  face: "--os-face",
  faceLight: "--os-face-light",
  faceDark: "--os-face-dark",
  frame: "--os-frame",
  frameLight: "--os-frame-light",
  insetBorder: "--os-inset-border",
  titlebarActiveFrom: "--os-titlebar-active-from",
  titlebarActiveMid: "--os-titlebar-active-mid",
  titlebarActiveTo: "--os-titlebar-active-to",
  titlebarInactiveFrom: "--os-titlebar-inactive-from",
  titlebarInactiveTo: "--os-titlebar-inactive-to",
  titlebarText: "--os-titlebar-text",
  titlebarAccent: "--os-titlebar-accent",
  windowBackground: "--os-window-background",
  windowBorder: "--os-window-border",
  windowContentText: "--os-window-content-text",
  textPrimary: "--os-text-primary",
  textSecondary: "--os-text-secondary",
  textMuted: "--os-text-muted",
  textHeading: "--os-text-heading",
  textDisabled: "--os-text-disabled",
  textOnAccent: "--os-text-on-accent",
  selection: "--os-selection",
  selectionText: "--os-selection-text",
  hover: "--os-hover",
  hoverSoft: "--os-hover-soft",
  menuBorder: "--os-menu-border",
  fieldBorder: "--os-field-border",
  fieldBackground: "--os-field-background",
  taskbarFrom: "--os-taskbar-from",
  taskbarTo: "--os-taskbar-to",
  taskbarText: "--os-taskbar-text",
  startFrom: "--os-start-from",
  startTo: "--os-start-to",
  startText: "--os-start-text",
  balloonBackground: "--os-balloon-background",
  balloonBorder: "--os-balloon-border",
  balloonText: "--os-balloon-text",
  accent: "--os-accent",
  danger: "--os-danger",
  success: "--os-success",
  warning: "--os-warning",
  link: "--os-link",
  linkHover: "--os-link-hover",
  wallpaperOverlay: "--os-wallpaper-overlay",
};

export interface ThemeManager extends Manager {
  list(): readonly Theme[];
  current(): Theme;
  apply(id: string): void;
}

export const THEME_MANAGER = createToken<ThemeManager>("ThemeManager");

/**
 * Themes only write CSS variables. Any component that reads tokens updates
 * automatically, with no subscription and no re-render.
 */
export function createThemeManager(): ThemeManager {
  let active: Theme = THEMES[0]!;

  const paint = (theme: Theme) => {
    const root = document.documentElement;
    for (const [key, variable] of Object.entries(CSS_VARIABLE)) {
      root.style.setProperty(variable, theme.colors[key as keyof ThemeColors]);
    }
    root.dataset.theme = theme.id;
  };

  return {
    id: "theme",
    dependsOn: ["settings"],

    start() {
      const settings = resolve(SETTINGS_MANAGER);
      active = THEMES.find((t) => t.id === settings.get().theme) ?? THEMES[0]!;
      paint(active);
      settings.subscribe((next) => {
        if (next.theme === active.id) return;
        active = THEMES.find((t) => t.id === next.theme) ?? THEMES[0]!;
        paint(active);
      });
    },

    list: () => THEMES,
    current: () => active,
    apply(id) {
      resolve(SETTINGS_MANAGER).set("theme", id);
    },
  };
}
