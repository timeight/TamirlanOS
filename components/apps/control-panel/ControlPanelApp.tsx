"use client";

import { useState } from "react";
import {
  AboutPage,
  AccessibilityPage,
  AppearancePage,
  DesktopPage,
  PixPage,
  SoundPage,
  SystemPage,
} from "@/components/apps/control-panel/PanelPages";
import {
  CATEGORIES,
  PanelCategory,
  searchCategories,
} from "@/core/control-panel/categories";
import { cn } from "@/core/utils/cn";
import { useSettings } from "@/hooks/use-settings";

/** Survives closing the window, as the real Control Panel did. */
let lastCategory: PanelCategory = PanelCategory.Home;

export function ControlPanelApp() {
  const [category, setCategory] = useState(lastCategory);
  const [query, setQuery] = useState("");
  const binding = useSettings();

  const open = (next: PanelCategory) => {
    lastCategory = next;
    setCategory(next);
  };

  const current = CATEGORIES.find((item) => item.id === category);
  const results = searchCategories(query);

  return (
    <div className="@container flex h-full min-h-0 bg-white">
      <nav className="hidden w-[170px] shrink-0 flex-col gap-2 bg-[#7ba2e7] bg-gradient-to-b from-[#8fb3ee] to-[#6a93de] p-2 @[520px]:flex">
        <div className="rounded-[3px] bg-white/92 p-2">
          <p className="mb-1 text-[11px] font-bold text-[#215dc6]">
            Панель управления
          </p>
          <button
            type="button"
            onClick={() => open(PanelCategory.Home)}
            className="block text-left text-[11px] text-[#215dc6] hover:underline"
          >
            К начальной странице
          </button>
        </div>
        <div className="rounded-[3px] bg-white/92 p-2">
          <p className="mb-1 text-[11px] font-bold text-[#215dc6]">См. также</p>
          <ul className="space-y-0.5 text-[11px] text-[#215dc6]">
            {CATEGORIES.slice(0, 4).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => open(item.id)}
                  className="text-left hover:underline"
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-[var(--os-frame)] bg-[var(--os-face)] px-3 py-1.5">
          {category !== PanelCategory.Home && (
            <button
              type="button"
              onClick={() => open(PanelCategory.Home)}
              className="rounded-sm border border-[var(--os-frame)] px-2 py-0.5 text-[11px] hover:bg-[var(--os-hover-soft)]"
            >
              ← Назад
            </button>
          )}
          <h1 className="min-w-0 flex-1 truncate text-[12px] font-bold text-[var(--os-text-heading)]">
            {current ? current.title : "Выберите категорию"}
          </h1>
          {category === PanelCategory.Home && (
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск…"
              aria-label="Поиск по панели управления"
              className="w-[130px] rounded-sm border border-[var(--os-field-border)] bg-white px-2 py-0.5 text-[11px] outline-none"
            />
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-3">
          {category === PanelCategory.Home && (
            <ul className="grid grid-cols-1 gap-1 @[420px]:grid-cols-2">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => open(item.id)}
                    className="flex w-full items-start gap-2.5 rounded-sm p-2 text-left hover:bg-[var(--os-hover-soft)] focus-visible:outline-1 focus-visible:outline-[var(--os-accent)]"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 h-8 w-8 shrink-0 rounded-[3px] border border-[var(--os-frame)]",
                        "bg-gradient-to-b from-[var(--os-titlebar-active-mid)] to-[var(--os-titlebar-active-to)]",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold text-[var(--os-text-heading)]">
                        {item.title}
                      </span>
                      <span className="block text-[11px] text-[var(--os-text-secondary)]">
                        {item.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="p-3 text-[11px] text-[var(--os-text-secondary)]">
                  Ничего не найдено.
                </li>
              )}
            </ul>
          )}

          {category === PanelCategory.Appearance && (
            <AppearancePage {...binding} />
          )}
          {category === PanelCategory.Desktop && <DesktopPage {...binding} />}
          {category === PanelCategory.Pix && <PixPage {...binding} />}
          {category === PanelCategory.Sound && <SoundPage {...binding} />}
          {category === PanelCategory.Accessibility && (
            <AccessibilityPage {...binding} />
          )}
          {category === PanelCategory.System && <SystemPage {...binding} />}
          {category === PanelCategory.About && <AboutPage />}
        </div>
      </div>
    </div>
  );
}
