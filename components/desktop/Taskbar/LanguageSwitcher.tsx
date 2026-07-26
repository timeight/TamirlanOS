"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES } from "@/core/i18n/locales";
import { cn } from "@/core/utils/cn";
import { useLocaleStore } from "@/stores/locale-store";

export function LanguageSwitcher() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((item) => item.id === locale) ?? LOCALES[0]!;

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-stretch">
      <button
        type="button"
        aria-label="Тіл / Язык / Language"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center px-2 text-[11px] font-bold text-white hover:bg-white/15"
        style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}
      >
        {current.short}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 bottom-full mb-1 w-32 overflow-hidden rounded-sm border border-[#8a8676] bg-white text-black shadow-[2px_2px_8px_rgba(0,0,0,0.4)]"
        >
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setLocale(item.id);
                setOpen(false);
              }}
              className={cn(
                "hover:bg-xp-selection flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] hover:text-white",
                item.id === locale && "font-bold",
              )}
            >
              <span className="w-8 text-[10px] text-[#4a5a70] group-hover:text-white">
                {item.short}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
