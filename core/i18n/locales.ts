import type { Locale } from "@/types/locale";

export interface LocaleInfo {
  id: Locale;
  short: string;
  name: string;
}

export const LOCALES: readonly LocaleInfo[] = [
  { id: "kk", short: "ҚАЗ", name: "Қазақша" },
  { id: "ru", short: "РУС", name: "Русский" },
  { id: "en", short: "ENG", name: "English" },
];
