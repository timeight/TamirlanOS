import { AppKey } from "@/core/apps/app-catalog";
import type { DesktopIcon } from "@/types/desktop-icon";

export const DEFAULT_ICONS: readonly DesktopIcon[] = [
  {
    id: AppKey.Portfolio,
    appId: AppKey.Portfolio,
    label: "desktop.portfolio",
    iconSrc: "/assets/icons/portfolio.svg",
    slot: { column: 0, row: 0 },
  },
  {
    id: AppKey.AboutMe,
    appId: AppKey.AboutMe,
    label: "app.about-me",
    iconSrc: "/assets/icons/about-me.svg",
    slot: { column: 0, row: 1 },
  },
  {
    id: AppKey.Projects,
    appId: AppKey.Projects,
    label: "app.projects",
    iconSrc: "/assets/icons/projects.svg",
    slot: { column: 0, row: 2 },
  },
  {
    id: AppKey.Resume,
    appId: AppKey.Resume,
    label: "app.resume",
    iconSrc: "/assets/icons/resume.svg",
    slot: { column: 0, row: 3 },
  },
  {
    id: AppKey.Skills,
    appId: AppKey.Skills,
    label: "app.skills",
    iconSrc: "/assets/icons/skills.svg",
    slot: { column: 0, row: 4 },
  },
  {
    id: AppKey.Photography,
    appId: AppKey.Photography,
    label: "app.photography",
    iconSrc: "/assets/icons/photography.svg",
    slot: { column: 1, row: 0 },
  },
  {
    id: AppKey.Ideas,
    appId: AppKey.Ideas,
    label: "app.ideas",
    iconSrc: "/assets/icons/ideas.svg",
    slot: { column: 1, row: 1 },
  },
  {
    id: AppKey.Contact,
    appId: AppKey.Contact,
    label: "app.contact",
    iconSrc: "/assets/icons/contact.svg",
    slot: { column: 1, row: 2 },
  },
  {
    id: AppKey.InternetExplorer,
    appId: AppKey.InternetExplorer,
    label: "app.ie",
    iconSrc: "/assets/icons/ie.svg",
    slot: { column: 0, row: 5 },
  },
  {
    id: AppKey.RecycleBin,
    appId: AppKey.RecycleBin,
    label: "app.recycle-bin",
    iconSrc: "/assets/icons/recycle-bin.svg",
    slot: { column: 1, row: 3 },
  },
];
