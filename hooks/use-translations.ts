"use client";

import { useCallback } from "react";
import { translations } from "@/core/i18n/translations";
import { useLocaleStore } from "@/stores/locale-store";

export function useT() {
  const locale = useLocaleStore((state) => state.locale);
  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = translations[key]?.[locale] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [locale],
  );
}
