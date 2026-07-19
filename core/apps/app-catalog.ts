import {
  getApplication,
  registerApplication,
} from "@/core/process/app-registry";
import type { ApplicationManifest } from "@/types/application";

export enum AppKey {
  Welcome = "welcome",
  Portfolio = "portfolio",
  AboutMe = "about-me",
  Projects = "projects",
  Skills = "skills",
  Contact = "contact",
  Resume = "resume",
  Photography = "photography",
  Gallery3D = "gallery-3d",
  Timeline = "timeline",
  Certificates = "certificates",
  Ideas = "ideas",
}

export const APP_CATALOG: readonly ApplicationManifest[] = [
  {
    id: AppKey.Welcome,
    title: "Welcome to TamirlanOS",
    iconSrc: "/assets/icons/welcome.svg",
    defaultSize: { width: 430, height: 400 },
    minSize: { width: 360, height: 320 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Portfolio,
    title: "Portfolio Explorer",
    iconSrc: "/assets/icons/portfolio.svg",
    defaultSize: { width: 480, height: 380 },
    minSize: { width: 360, height: 280 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.AboutMe,
    title: "About Me",
    iconSrc: "/assets/icons/about-me.svg",
    defaultSize: { width: 780, height: 560 },
    minSize: { width: 520, height: 400 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Projects,
    title: "Projects",
    iconSrc: "/assets/icons/projects.svg",
    defaultSize: { width: 580, height: 420 },
    minSize: { width: 440, height: 320 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Skills,
    title: "Skills",
    iconSrc: "/assets/icons/skills.svg",
    defaultSize: { width: 460, height: 420 },
    minSize: { width: 360, height: 300 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Contact,
    title: "Contact",
    iconSrc: "/assets/icons/contact.svg",
    defaultSize: { width: 430, height: 330 },
    minSize: { width: 360, height: 280 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Resume,
    title: "Resume",
    iconSrc: "/assets/icons/resume.svg",
    defaultSize: { width: 530, height: 470 },
    minSize: { width: 420, height: 340 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Photography,
    title: "Photography",
    iconSrc: "/assets/icons/photography.svg",
    defaultSize: { width: 620, height: 460 },
    minSize: { width: 460, height: 340 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Gallery3D,
    title: "3D Gallery",
    iconSrc: "/assets/icons/gallery-3d.svg",
    defaultSize: { width: 480, height: 430 },
    minSize: { width: 380, height: 340 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Timeline,
    title: "Timeline",
    iconSrc: "/assets/icons/timeline.svg",
    defaultSize: { width: 470, height: 450 },
    minSize: { width: 380, height: 320 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Certificates,
    title: "Certificates",
    iconSrc: "/assets/icons/certificates.svg",
    defaultSize: { width: 540, height: 450 },
    minSize: { width: 420, height: 340 },
    resizable: true,
    singleton: true,
  },
  {
    id: AppKey.Ideas,
    title: "Ideas",
    iconSrc: "/assets/icons/ideas.svg",
    defaultSize: { width: 470, height: 400 },
    minSize: { width: 360, height: 300 },
    resizable: true,
    singleton: true,
  },
];

export function installApps(): void {
  for (const manifest of APP_CATALOG) {
    if (!getApplication(manifest.id)) registerApplication(manifest);
  }
}
