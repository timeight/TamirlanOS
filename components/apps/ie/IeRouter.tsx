"use client";

import {
  AiLabPage,
  DeveloperPage,
  NotFoundPage,
  PhotographyPage,
  SecretPage,
  SimplePage,
  WindowsUpdatePage,
} from "@/components/apps/ie/pages/ContentPages";
import { HomePage } from "@/components/apps/ie/pages/HomePage";
import {
  GithubPage,
  InstagramPage,
  LinkedInPage,
} from "@/components/apps/ie/pages/SocialPages";
import { AppKey } from "@/core/apps/app-catalog";
import { PageId, type PageMeta } from "@/core/browser/pages";

interface RouterProps {
  page: PageMeta;
  devMode: boolean;
  onNavigate: (input: string) => void;
  onExternal: (url: string, host: string) => void;
}

export function ContentPagesRouter({
  page,
  devMode,
  onNavigate,
  onExternal,
}: RouterProps) {
  switch (page.id) {
    case PageId.Home:
      return <HomePage onNavigate={onNavigate} />;
    case PageId.Github:
      return <GithubPage onExternal={onExternal} />;
    case PageId.Instagram:
      return <InstagramPage onExternal={onExternal} />;
    case PageId.LinkedIn:
      return <LinkedInPage onExternal={onExternal} />;
    case PageId.Photography:
      return <PhotographyPage />;
    case PageId.AiLab:
      return <AiLabPage />;
    case PageId.WindowsUpdate:
      return <WindowsUpdatePage />;
    case PageId.Secret:
      return <SecretPage />;
    case PageId.Developer:
      return <DeveloperPage enabled={devMode} />;
    case PageId.Telegram:
      return (
        <SimplePage
          titleKey="ie.page.telegram"
          bodyKey="ie.tg.body"
          appId={AppKey.Contact}
          openLabelKey="ie.openContact"
        />
      );
    case PageId.Resume:
      return (
        <SimplePage
          titleKey="ie.page.resume"
          bodyKey="ie.resume.body"
          appId={AppKey.Resume}
          openLabelKey="ie.openResume"
        />
      );
    case PageId.Projects:
      return (
        <SimplePage
          titleKey="ie.page.projects"
          bodyKey="ie.projects.body"
          appId={AppKey.Projects}
          openLabelKey="ie.openProjects"
        />
      );
    case PageId.Gallery:
      return (
        <SimplePage
          titleKey="ie.page.gallery"
          bodyKey="ie.gallery.body"
          appId={AppKey.Gallery3D}
          openLabelKey="ie.openGallery"
        />
      );
    case PageId.About:
      return (
        <SimplePage
          titleKey="ie.page.about"
          bodyKey="ie.about.body"
          appId={AppKey.AboutMe}
          openLabelKey="ie.openAbout"
        />
      );
    case PageId.Contact:
      return (
        <SimplePage
          titleKey="ie.page.contact"
          bodyKey="ie.contact.body"
          appId={AppKey.Contact}
          openLabelKey="ie.openContact"
        />
      );
    case PageId.Blog:
      return (
        <SimplePage
          titleKey="ie.page.blog"
          bodyKey="ie.blog.body"
          appId={AppKey.Ideas}
          openLabelKey="ie.openIdeas"
        />
      );
    case PageId.System32:
      return (
        <SimplePage
          titleKey="ie.page.system32"
          bodyKey="ie.sys32.body"
          appId={AppKey.Portfolio}
          openLabelKey="ie.openExplorer"
        />
      );
    default:
      return <NotFoundPage url={page.url} />;
  }
}
