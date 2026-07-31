export enum PageId {
  Home = "home",
  Github = "github",
  LinkedIn = "linkedin",
  Instagram = "instagram",
  Telegram = "telegram",
  Photography = "photography",
  Resume = "resume",
  Projects = "projects",
  Gallery = "gallery",
  About = "about",
  Contact = "contact",
  AiLab = "ai",
  Blog = "blog",
  WindowsUpdate = "windowsupdate",
  Developer = "developer",
  System32 = "system32",
  Secret = "secret",
  NotFound = "404",
}

export interface PageMeta {
  id: PageId;
  url: string;
  titleKey: string;
  aliases: readonly string[];
}

export const PAGES: readonly PageMeta[] = [
  {
    id: PageId.Home,
    url: "about:tamirlan",
    titleKey: "ie.page.home",
    aliases: ["about:tamirlan", "home", "tamirlan", "about:blank"],
  },
  {
    id: PageId.Github,
    url: "http://www.github.com/timeight",
    titleKey: "ie.page.github",
    aliases: ["github", "github.com", "www.github.com", "git"],
  },
  {
    id: PageId.LinkedIn,
    url: "http://www.linkedin.com/in/tamirlan",
    titleKey: "ie.page.linkedin",
    aliases: ["linkedin", "linkedin.com", "www.linkedin.com", "in"],
  },
  {
    id: PageId.Instagram,
    url: "http://www.instagram.com/zhamallov",
    titleKey: "ie.page.instagram",
    aliases: ["instagram", "instagram.com", "insta", "ig"],
  },
  {
    id: PageId.Telegram,
    url: "http://t.me/zhamallov",
    titleKey: "ie.page.telegram",
    aliases: ["telegram", "t.me", "tg"],
  },
  {
    id: PageId.Photography,
    url: "http://tamirlan.kz/photography",
    titleKey: "ie.page.photography",
    aliases: ["photography", "photo", "photos"],
  },
  {
    id: PageId.Gallery,
    url: "http://tamirlan.kz/gallery",
    titleKey: "ie.page.gallery",
    aliases: ["gallery", "3d", "renders"],
  },
  {
    id: PageId.Resume,
    url: "http://tamirlan.kz/resume",
    titleKey: "ie.page.resume",
    aliases: ["resume", "cv"],
  },
  {
    id: PageId.Projects,
    url: "http://tamirlan.kz/projects",
    titleKey: "ie.page.projects",
    aliases: ["projects", "work"],
  },
  {
    id: PageId.About,
    url: "http://tamirlan.kz/about",
    titleKey: "ie.page.about",
    aliases: ["about", "me"],
  },
  {
    id: PageId.Contact,
    url: "http://tamirlan.kz/contact",
    titleKey: "ie.page.contact",
    aliases: ["contact", "mail", "email"],
  },
  {
    id: PageId.AiLab,
    url: "http://tamirlan.kz/ai-lab",
    titleKey: "ie.page.ai",
    aliases: ["ai", "ai-lab", "ailab", "lab"],
  },
  {
    id: PageId.Blog,
    url: "http://tamirlan.kz/blog",
    titleKey: "ie.page.blog",
    aliases: ["blog", "notes"],
  },
  {
    id: PageId.WindowsUpdate,
    url: "http://windowsupdate.microsoft.com",
    titleKey: "ie.page.update",
    aliases: ["windowsupdate", "update"],
  },
  {
    id: PageId.Developer,
    url: "about:developer",
    titleKey: "ie.page.developer",
    aliases: ["developer", "dev", "about:developer"],
  },
  {
    id: PageId.System32,
    url: "file:///C:/WINDOWS/system32",
    titleKey: "ie.page.system32",
    aliases: ["system32", "c:\\windows\\system32"],
  },
  {
    id: PageId.Secret,
    url: "about:secret",
    titleKey: "ie.page.secret",
    aliases: ["secret", "about:secret"],
  },
];

export const HOME_PAGE = PAGES[0]!;

const NOT_FOUND: PageMeta = {
  id: PageId.NotFound,
  url: "",
  titleKey: "ie.page.404",
  aliases: [],
};

export function resolveUrl(input: string): PageMeta {
  const query = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
  if (!query) return HOME_PAGE;
  const match = PAGES.find((page) =>
    page.aliases.some(
      (alias) =>
        alias.replace(/^www\./, "") === query ||
        query.startsWith(alias.replace(/^www\./, "") + "/"),
    ),
  );
  return match ?? { ...NOT_FOUND, url: input.trim() };
}
