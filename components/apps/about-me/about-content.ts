// Handles below are placeholders — swap in the real profile URLs.
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

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
    href: "https://github.com/tamirlanzhamalov",
    icon: "/assets/icons/social-github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/tamirlanzhamalov",
    icon: "/assets/icons/social-linkedin.svg",
  },
];

export const SKILLS: readonly string[] = [
  "Software Engineering",
  "Artificial Intelligence",
  "3D Art & Rendering",
  "UI / UX Design",
  "Motion Design",
  "Photography",
  "Teaching & Mentoring",
  "Product Thinking",
];

export const SOFTWARE: readonly string[] = [
  "VS Code · Cursor",
  "Claude · ChatGPT · Gemini",
  "Blender · Maya · ZBrush",
  "Figma · Photoshop · Illustrator",
  "DaVinci Resolve",
  "Git · GitHub · Docker",
];

export interface BioSection {
  heading: string;
  body: string;
}

export const BIO_SECTIONS: readonly BioSection[] = [
  {
    heading: "Who I am",
    body: "I'm a multidisciplinary creator combining software engineering, artificial intelligence, design, education and digital art. For me programming is not just writing code — every project should feel like a product with its own personality. I enjoy building experiences rather than ordinary applications, learning difficult subjects and turning them into beautiful products.",
  },
  {
    heading: "My mission",
    body: "Create software that people remember. Not another CRUD application, not another dashboard — products that surprise users and create emotion.",
  },
  {
    heading: "Philosophy",
    body: "Technology should not only solve problems — it should create emotions. Software should feel handcrafted. Every pixel matters, every animation matters, every interaction tells a story.",
  },
  {
    heading: "Dream",
    body: "Build world-class software products and memorable experiences. Combine AI, design and engineering into one ecosystem, launch products used by millions, and build a company known for craftsmanship instead of quantity. Never stop learning.",
  },
];
