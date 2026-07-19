import { ThemeId, type Theme } from "@/types/theme";

export const THEMES: Readonly<Record<ThemeId, Theme>> = {
  [ThemeId.LunaBlue]: { id: ThemeId.LunaBlue, name: "Luna" },
  [ThemeId.LunaOlive]: { id: ThemeId.LunaOlive, name: "Luna Olive Green" },
  [ThemeId.LunaSilver]: { id: ThemeId.LunaSilver, name: "Luna Silver" },
  [ThemeId.Classic]: { id: ThemeId.Classic, name: "Tamirlan Classic" },
};

export const DEFAULT_THEME: Theme = THEMES[ThemeId.LunaBlue];
