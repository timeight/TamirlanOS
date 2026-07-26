import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/types/locale";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "kk",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "tamirlanos-locale" },
  ),
);
