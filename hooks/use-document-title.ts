"use client";

import { useEffect } from "react";
import { useT } from "@/hooks/use-translations";
import { useLocaleStore } from "@/stores/locale-store";
import { useWindowStore } from "@/stores/window-store";

// Keeps the browser tab (title + lang) in sync with the current language and focused app.
export function useDocumentTitle() {
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);
  const focusedAppId = useWindowStore((state) =>
    state.focusedId ? state.windows[state.focusedId]?.appId : undefined,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = focusedAppId
      ? `${t(`app.${focusedAppId}`)} — TamirlanOS`
      : `TamirlanOS — ${t("os.tagline")}`;
  }, [t, locale, focusedAppId]);
}
