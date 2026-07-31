"use client";

import { useEffect, useState } from "react";
import { HOME_PAGE, PAGES, PageId } from "@/core/browser/pages";
import { cn } from "@/core/utils/cn";
import { useT } from "@/hooks/use-translations";
import { useBrowserStore } from "@/stores/browser-store";

interface IeToolbarProps {
  onNavigate: (input: string) => void;
  busy: boolean;
}

const FAVORITES: readonly PageId[] = [
  PageId.Home,
  PageId.Projects,
  PageId.Photography,
  PageId.Github,
  PageId.LinkedIn,
  PageId.Resume,
  PageId.AiLab,
];

const MENUS = [
  "win.file",
  "win.edit",
  "win.view",
  "win.favorites",
  "ie.menu.tools",
  "win.help",
] as const;

export function IeToolbar({ onNavigate, busy }: IeToolbarProps) {
  const page = useBrowserStore((state) => state.current());
  const back = useBrowserStore((state) => state.back);
  const forward = useBrowserStore((state) => state.forward);
  const canBack = useBrowserStore((state) => state.canBack());
  const canForward = useBrowserStore((state) => state.canForward());
  const [draft, setDraft] = useState(page.url);
  const [favOpen, setFavOpen] = useState(false);
  const t = useT();

  useEffect(() => setDraft(page.url), [page]);

  return (
    <div className="shrink-0">
      <div className="flex items-stretch border-b border-[#aca899] bg-[#f7f5ec] px-1 text-[11px]">
        {MENUS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => key === "win.favorites" && setFavOpen(!favOpen)}
            className="px-2 py-1 hover:bg-[#d6e6f8]"
          >
            {t(key)}
          </button>
        ))}
      </div>

      {favOpen && (
        <div className="relative">
          <div className="absolute top-0 left-16 z-20 min-w-[180px] border border-[#8a8676] bg-white py-1 shadow-[2px_2px_6px_rgba(0,0,0,0.3)]">
            {FAVORITES.map((id) => {
              const target = PAGES.find((item) => item.id === id) ?? HOME_PAGE;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setFavOpen(false);
                    onNavigate(id);
                  }}
                  className="hover:bg-xp-selection flex w-full items-center gap-2 px-3 py-1 text-left text-[11px] hover:text-white"
                >
                  <StarIcon />
                  {t(target.titleKey)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-0.5 border-b border-[#aca899] bg-gradient-to-b from-[#faf9f5] to-[#e8e5d8] px-1 py-1">
        <NavButton onClick={back} disabled={!canBack} label={t("win.back")}>
          <Arrow dir="left" />
        </NavButton>
        <NavButton
          onClick={forward}
          disabled={!canForward}
          label={t("win.forward")}
        >
          <Arrow dir="right" />
        </NavButton>
        <NavButton
          onClick={() => onNavigate(page.id)}
          disabled={!busy}
          label={t("ie.stop")}
        >
          <span className="text-[13px] text-[#c0392b]">✕</span>
        </NavButton>
        <NavButton onClick={() => onNavigate(page.id)} label={t("ie.refresh")}>
          <span className="text-[13px] text-[#2f6f3d]">⟳</span>
        </NavButton>
        <NavButton onClick={() => onNavigate("home")} label={t("ie.home")}>
          <span className="text-[13px]">⌂</span>
        </NavButton>
      </div>

      <div className="flex items-center gap-1 border-b border-[#aca899] bg-[#f4f3ee] px-1.5 py-1 text-[11px]">
        <span className="hidden text-[#4a5a70] @[360px]:inline">
          {t("win.address")}
        </span>
        <form
          className="flex min-w-0 flex-1 items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault();
            onNavigate(draft);
          }}
        >
          <span className="flex min-w-0 flex-1 items-center gap-1 rounded-[2px] border border-[#7f9db9] bg-white px-1.5 py-0.5">
            <GlobeSmall />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[11px] outline-none"
            />
          </span>
          <button
            type="submit"
            className="rounded-[2px] border border-[#8a8676] bg-gradient-to-b from-white to-[#e0ddd0] px-2 py-0.5 hover:brightness-105"
          >
            {t("win.go")}
          </button>
        </form>
      </div>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  disabled = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex items-center gap-1 rounded-[3px] border border-transparent px-2 py-0.5 text-[11px]",
        disabled
          ? "text-[#a8a8a8]"
          : "hover:border-[#a9cdec] hover:bg-[#e6f0fb]",
      )}
    >
      {children}
      <span className="hidden @[420px]:inline">{label}</span>
    </button>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d={dir === "left" ? "M11 2 4 8l7 6z" : "M5 2l7 6-7 6z"}
        fill="#2f6f3d"
      />
    </svg>
  );
}

function GlobeSmall() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="#2b6cb0"
      strokeWidth="1.2"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c1.8 2 1.8 10 0 12M8 2c-1.8 2-1.8 10 0 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="m8 2 1.7 3.6 3.8.5-2.8 2.6.8 3.8L8 10.6 4.5 12.5l.8-3.8L2.5 6.1l3.8-.5z"
        fill="#f0c14b"
        stroke="#b8860b"
        strokeWidth="0.8"
      />
    </svg>
  );
}
