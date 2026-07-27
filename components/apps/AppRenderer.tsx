"use client";

import { AboutMeApp } from "@/components/apps/about-me/AboutMeApp";
import { AgentApp } from "@/components/apps/agent/AgentApp";
import { CertificatesApp } from "@/components/apps/certificates/CertificatesApp";
import { CheckersApp } from "@/components/apps/checkers/CheckersApp";
import { ContactApp } from "@/components/apps/contact/ContactApp";
import { Gallery3DApp } from "@/components/apps/gallery-3d/Gallery3DApp";
import { Game2048App } from "@/components/apps/game-2048/Game2048App";
import { IdeasApp } from "@/components/apps/ideas/IdeasApp";
import { MinesweeperApp } from "@/components/apps/minesweeper/MinesweeperApp";
import { PaintApp } from "@/components/apps/paint/PaintApp";
import { PhotographyApp } from "@/components/apps/photography/PhotographyApp";
import { PortfolioApp } from "@/components/apps/portfolio/PortfolioApp";
import { ProjectsApp } from "@/components/apps/projects/ProjectsApp";
import { ResumeApp } from "@/components/apps/resume/ResumeApp";
import { ShooterApp } from "@/components/apps/shooter/ShooterApp";
import { SkillsApp } from "@/components/apps/skills/SkillsApp";
import { TicTacToeApp } from "@/components/apps/tic-tac-toe/TicTacToeApp";
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
    case AppKey.Paint:
      return <PaintApp />;
    case AppKey.Minesweeper:
      return <MinesweeperApp />;
    case AppKey.Checkers:
      return <CheckersApp />;
    case AppKey.Game2048:
      return <Game2048App />;
    case AppKey.TicTacToe:
      return <TicTacToeApp />;
    case AppKey.Shooter:
      return <ShooterApp />;
    case AppKey.Agent:
      return <AgentApp />;
    default:
      return null;
  }
}
