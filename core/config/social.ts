export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

// Single source of truth for every social link (About Me + Start menu).
// Replace the usernames below with your real profiles.
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/zhamallov/",
    icon: "/assets/icons/social-instagram.svg",
  },
  {
    name: "Threads",
    href: "https://threads.net/@zhamallov",
    icon: "/assets/icons/social-threads.svg",
  },
  {
    name: "Telegram",
    href: "https://t.me/zhamallov",
    icon: "/assets/icons/social-telegram.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/timeight",
    icon: "/assets/icons/social-github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tamirlan-zhamalov-83aa8821a/",
    icon: "/assets/icons/social-linkedin.svg",
  },
];
