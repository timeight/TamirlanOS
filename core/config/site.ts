export const siteConfig = {
  name: "TamirlanOS",
  description: "A desktop operating system experience in the browser.",
  avatarSrc: "/assets/avatars/tamirlan.png",
} as const;

export type SiteConfig = typeof siteConfig;
