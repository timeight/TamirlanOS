"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useEffect, useRef, useState } from "react";
import { ProgramsFlyout } from "@/components/desktop/StartMenu/ProgramsFlyout";
import { SoftwareFlyout } from "@/components/desktop/StartMenu/SoftwareFlyout";
import { StartMenuItem } from "@/components/desktop/StartMenu/StartMenuItem";
import { AppKey } from "@/core/apps/app-catalog";
import { siteConfig } from "@/core/config/site";
import { SOCIAL_LINKS } from "@/core/config/social";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";
import type { AppId } from "@/types/application";

interface StartMenuProps {
  onClose: () => void;
  onShutdownRequest: () => void;
}

const PRIMARY_ITEMS = [
  {
    label: "app.about-me",
    subtitle: "start.aboutSub",
    iconSrc: "/assets/icons/about-me.svg",
    appId: AppKey.AboutMe,
  },
  {
    label: "start.myProjects",
    subtitle: "start.myProjects.sub",
    iconSrc: "/assets/icons/projects.svg",
    appId: AppKey.Projects,
  },
  {
    label: "start.myResume",
    subtitle: "start.myResume.sub",
    iconSrc: "/assets/icons/resume.svg",
    appId: AppKey.Resume,
  },
  {
    label: "app.contact",
    subtitle: "start.contactSub",
    iconSrc: "/assets/icons/contact.svg",
    appId: AppKey.Contact,
  },
] as const;

const SECONDARY_ITEMS = [
  {
    label: "app.photography",
    iconSrc: "/assets/icons/photography.svg",
    appId: AppKey.Photography,
  },
  {
    label: "app.gallery-3d",
    iconSrc: "/assets/icons/gallery-3d.svg",
    appId: AppKey.Gallery3D,
  },
  {
    label: "app.skills",
    iconSrc: "/assets/icons/skills.svg",
    appId: AppKey.Skills,
  },
  {
    label: "app.timeline",
    iconSrc: "/assets/icons/timeline.svg",
    appId: AppKey.Timeline,
  },
  {
    label: "app.certificates",
    iconSrc: "/assets/icons/certificates.svg",
    appId: AppKey.Certificates,
  },
  {
    label: "app.ideas",
    iconSrc: "/assets/icons/ideas.svg",
    appId: AppKey.Ideas,
  },
  {
    label: "app.paint",
    iconSrc: "/assets/icons/paint.svg",
    appId: AppKey.Paint,
  },
  {
    label: "app.minesweeper",
    iconSrc: "/assets/icons/minesweeper.svg",
    appId: AppKey.Minesweeper,
  },
  {
    label: "app.checkers",
    iconSrc: "/assets/icons/checkers.svg",
    appId: AppKey.Checkers,
  },
  {
    label: "app.game-2048",
    iconSrc: "/assets/icons/game-2048.svg",
    appId: AppKey.Game2048,
  },
  {
    label: "app.tic-tac-toe",
    iconSrc: "/assets/icons/tic-tac-toe.svg",
    appId: AppKey.TicTacToe,
  },
  {
    label: "app.shooter",
    iconSrc: "/assets/icons/shooter.svg",
    appId: AppKey.Shooter,
  },
] as const;

const RIGHT_ITEMS = [
  { label: "start.settings", iconSrc: "/assets/icons/settings.svg" },
  { label: "start.search", iconSrc: "/assets/icons/search.svg" },
  { label: "start.terminal", iconSrc: "/assets/icons/terminal.svg" },
  { label: "start.run", iconSrc: "/assets/icons/run.svg" },
] as const;

export function StartMenu({ onClose, onShutdownRequest }: StartMenuProps) {
  const openApp = useOpenApp();
  const logOff = useSystemStore((state) => state.logOff);
  const menuRef = useRef<HTMLDivElement>(null);
  const [flyout, setFlyout] = useState<"programs" | "software" | null>(null);
  const t = useT();

  useEffect(() => {
    menuRef.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const launch = (appId: AppId) => {
    onClose();
    openApp(appId);
  };

  return (
    <>
      <div className="fixed inset-0 z-[65]" onClick={onClose} />
      <div className="animate-fade-in absolute bottom-[30px] left-0 z-[70] motion-reduce:animate-none">
        {flyout === "programs" && <ProgramsFlyout onLaunch={launch} />}
        {flyout === "software" && <SoftwareFlyout />}
        <div
          ref={menuRef}
          role="menu"
          aria-label={t("startmenu.aria")}
          className="w-[min(380px,100vw)] overflow-hidden rounded-t-[8px] shadow-[3px_-2px_10px_rgba(0,0,0,0.45)]"
          style={{ border: "1px solid #0831d9", borderBottom: "none" }}
        >
          <div
            className="flex h-[58px] items-center gap-2.5 border-b-2 border-[#f0a63c] px-2.5"
            style={{
              background:
                "linear-gradient(180deg, #1c68d8 0%, #3f8cf3 12%, #2a6de0 25%, #1956c4 70%, #1044a5 100%)",
            }}
          >
            <Image
              src={siteConfig.avatarSrc}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="rounded-md border-2 border-white/70"
            />
            <span
              className="text-[15px] font-bold text-white"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
              {t("user.name")}
            </span>
          </div>
          <div className="flex">
            <div className="flex flex-1 flex-col bg-white py-1">
              {PRIMARY_ITEMS.map((item) => (
                <StartMenuItem
                  key={item.label}
                  label={t(item.label)}
                  subtitle={t(item.subtitle)}
                  iconSrc={item.iconSrc}
                  bold
                  onSelect={() => launch(item.appId)}
                />
              ))}
              <div className="mx-2 my-1 border-t border-[#d8dde5]" />
              {SECONDARY_ITEMS.map((item) => (
                <StartMenuItem
                  key={item.label}
                  label={t(item.label)}
                  iconSrc={item.iconSrc}
                  onSelect={() => launch(item.appId)}
                />
              ))}
              <div className="mx-2 my-1 mt-auto border-t border-[#d8dde5]" />
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={flyout === "programs"}
                onClick={() =>
                  setFlyout((current) =>
                    current === "programs" ? null : "programs",
                  )
                }
                onPointerEnter={() => setFlyout("programs")}
                className="hover:bg-xp-selection focus-visible:bg-xp-selection flex w-full items-center justify-center gap-2 px-2 py-1.5 text-[11px] font-bold hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                {t("start.allPrograms")}
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #9fe07a, #2f8a1c 75%)",
                  }}
                >
                  ▶
                </span>
              </button>
            </div>
            <div className="w-[142px] border-l border-[#96b8e0] bg-[#d3e5fa] py-1">
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={flyout === "software"}
                onClick={() =>
                  setFlyout((current) =>
                    current === "software" ? null : "software",
                  )
                }
                onPointerEnter={() => setFlyout("software")}
                className="hover:bg-xp-selection focus-visible:bg-xp-selection flex w-full items-center gap-2 px-2 py-1 text-left text-[11px] font-bold hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-[3px] bg-[#3a6fce] text-[10px] text-white"
                >
                  ★
                </span>
                <span className="flex-1">{t("start.recent")}</span>
                <span aria-hidden="true">▶</span>
              </button>
              <div className="mx-2 my-1 border-t border-[#96b8e0]" />
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={onClose}
                  className="hover:bg-xp-selection focus-visible:bg-xp-selection flex w-full items-center gap-2 px-2 py-1 text-[11px] hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  <Image
                    src={link.icon}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                    draggable={false}
                  />
                  <span className="truncate">{link.name}</span>
                </a>
              ))}
              <div className="mx-2 my-1 border-t border-[#96b8e0]" />
              {RIGHT_ITEMS.map((item) => (
                <StartMenuItem
                  key={item.label}
                  label={t(item.label)}
                  iconSrc={item.iconSrc}
                  disabled
                />
              ))}
            </div>
          </div>
          <div
            className="flex h-10 items-center justify-end gap-1 px-2"
            style={{
              background:
                "linear-gradient(180deg, #4282d6 0%, #3b74c9 8%, #2c61b6 40%, #1e4a9e 100%)",
            }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                logOff();
              }}
              className="flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-[11px] text-white hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-[4px] border border-white/40"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #ffd067, #d07a12 75%)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="8.5" r="3.5" />
                  <path d="M5.5 20c.8-4 3.5-6 6.5-6s5.7 2 6.5 6" />
                </svg>
              </span>
              {t("start.logoff")}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                onShutdownRequest();
              }}
              className="flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-[11px] text-white hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-[4px] border border-white/40"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #f08a6e, #c23417 75%)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v7" />
                  <path d="M7.5 7.5a7 7 0 1 0 9 0" />
                </svg>
              </span>
              {t("start.shutdown")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
