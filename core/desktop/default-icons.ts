import { AppKey } from "@/core/apps/app-catalog";
import type { DesktopIcon } from "@/types/desktop-icon";

export const DEFAULT_ICONS: readonly DesktopIcon[] = [
  {
    id: AppKey.Portfolio,
    appId: AppKey.Portfolio,
    label: "Portfolio",
    iconSrc: "/assets/icons/portfolio.svg",
    slot: { column: 0, row: 0 },
  },
  {
    id: AppKey.AboutMe,
    appId: AppKey.AboutMe,
    label: "About Me",
    iconSrc: "/assets/icons/about-me.svg",
    slot: { column: 0, row: 1 },
  },
  {
    id: AppKey.Projects,
    appId: AppKey.Projects,
    label: "Projects",
    iconSrc: "/assets/icons/projects.svg",
    slot: { column: 0, row: 2 },
  },
  {
    id: AppKey.Resume,
    appId: AppKey.Resume,
    label: "Resume",
    iconSrc: "/assets/icons/resume.svg",
    slot: { column: 0, row: 3 },
  },
  {
    id: AppKey.Skills,
    appId: AppKey.Skills,
    label: "Skills",
    iconSrc: "/assets/icons/skills.svg",
    slot: { column: 0, row: 4 },
  },
  {
    id: AppKey.Photography,
    appId: AppKey.Photography,
    label: "Photography",
    iconSrc: "/assets/icons/photography.svg",
    slot: { column: 1, row: 0 },
  },
  {
    id: AppKey.Ideas,
    appId: AppKey.Ideas,
    label: "Ideas",
    iconSrc: "/assets/icons/ideas.svg",
    slot: { column: 1, row: 1 },
  },
  {
    id: AppKey.Contact,
    appId: AppKey.Contact,
    label: "Contact",
    iconSrc: "/assets/icons/contact.svg",
    slot: { column: 1, row: 2 },
  },
];
