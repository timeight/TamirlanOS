"use client";

import { AboutMeApp } from "@/components/apps/about-me/AboutMeApp";
import { CertificatesApp } from "@/components/apps/certificates/CertificatesApp";
import { ContactApp } from "@/components/apps/contact/ContactApp";
import { Gallery3DApp } from "@/components/apps/gallery-3d/Gallery3DApp";
import { IdeasApp } from "@/components/apps/ideas/IdeasApp";
import { PhotographyApp } from "@/components/apps/photography/PhotographyApp";
import { PortfolioApp } from "@/components/apps/portfolio/PortfolioApp";
import { ProjectsApp } from "@/components/apps/projects/ProjectsApp";
import { ResumeApp } from "@/components/apps/resume/ResumeApp";
import { SkillsApp } from "@/components/apps/skills/SkillsApp";
import { TimelineApp } from "@/components/apps/timeline/TimelineApp";
import { WelcomeApp } from "@/components/apps/welcome/WelcomeApp";
import { AppKey } from "@/core/apps/app-catalog";
import type { AppId } from "@/types/application";

interface AppRendererProps {
  appId: AppId;
}

export function AppRenderer({ appId }: AppRendererProps) {
  switch (appId) {
    case AppKey.Welcome:
      return <WelcomeApp />;
    case AppKey.Portfolio:
      return <PortfolioApp />;
    case AppKey.AboutMe:
      return <AboutMeApp />;
    case AppKey.Projects:
      return <ProjectsApp />;
    case AppKey.Skills:
      return <SkillsApp />;
    case AppKey.Contact:
      return <ContactApp />;
    case AppKey.Resume:
      return <ResumeApp />;
    case AppKey.Photography:
      return <PhotographyApp />;
    case AppKey.Gallery3D:
      return <Gallery3DApp />;
    case AppKey.Timeline:
      return <TimelineApp />;
    case AppKey.Certificates:
      return <CertificatesApp />;
    case AppKey.Ideas:
      return <IdeasApp />;
    default:
      return null;
  }
}
