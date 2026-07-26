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
    href: "https://instagram.com/tamirlanzhamalov",
    icon: "/assets/icons/social-instagram.svg",
  },
  {
    name: "Threads",
    href: "https://threads.net/@tamirlanzhamalov",
    icon: "/assets/icons/social-threads.svg",
  },
  {
    name: "Telegram",
    href: "https://t.me/tamirlanzhamalov",
    icon: "/assets/icons/social-telegram.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/timeight",
    icon: "/assets/icons/social-github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/tamirlanzhamalov",
    icon: "/assets/icons/social-linkedin.svg",
  },
];
