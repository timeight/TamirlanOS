export interface NavItem {
  id: string;
  label: string;
}

export interface RoleCard {
  id: string;
  title: string;
  body: string;
  stack: readonly string[];
  accent: string;
}

export interface TimelineEntry {
  year: string;
  text: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "profile", label: "Профиль" },
  { id: "skills", label: "Навыки" },
  { id: "experience", label: "Опыт" },
  { id: "projects", label: "Проекты" },
  { id: "interests", label: "Интересы" },
  { id: "mission", label: "Миссия" },
  { id: "contacts", label: "Контакты" },
];

export const QUICK_LINKS: readonly NavItem[] = [
  { id: "works", label: "Мои проекты" },
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "email", label: "Email" },
];

export const TYPED_LINES: readonly string[] = [
  "Building digital worlds.",
  "Creating memorable experiences.",
  "Teaching through technology.",
  "Exploring AI.",
  "Turning ideas into products.",
];

export const ROLE_CARDS: readonly RoleCard[] = [
  {
    id: "3d",
    title: "3D ARTIST",
    body: "Создаю детализированные 3D-модели, окружения и анимации. Люблю пиксельную эстетику и реализм.",
    stack: ["Blender", "Maya", "ZBrush"],
    accent: "#5fd4ff",
  },
  {
    id: "dev",
    title: "DEVELOPER",
    body: "Пишу код, автоматизирую процессы и разрабатываю интерфейсы. C#, Python, Unity, SQL и многое другое.",
    stack: ["C#", "Python", "Unity", "SQL"],
    accent: "#5ff85f",
  },
  {
    id: "creator",
    title: "CREATOR",
    body: "Превращаю идеи в продукты. Исследую, экспериментирую и создаю то, что вдохновляет других.",
    stack: ["Design", "Motion", "AI"],
    accent: "#c98cff",
  },
];

export const TECH_STACK: readonly string[] = [
  "Blender",
  "Maya",
  "ZBrush",
  "Substance",
  "Unity",
  "Unreal Engine",
  "C#",
  "Python",
  "SQL Server",
  "Windows Forms",
  "Web Design",
  "Photoshop",
  "After Effects",
  "DaVinci Resolve",
  "Motion Design",
];

export const TIMELINE: readonly TimelineEntry[] = [
  { year: "2020", text: "Начал путь в 3D-графике" },
  { year: "2021", text: "Погрузился в программирование" },
  { year: "2022", text: "Создал первые коммерческие проекты" },
  { year: "2023", text: "Преподаватель в колледже" },
  { year: "2024", text: "Мир 3D, motion и автоматизации" },
  { year: "2025", text: "TamirlanOS — мечта становится реальностью" },
];

export const PIX_LINES: readonly string[] = [
  "Привет!",
  "Рад, что ты здесь.",
  "Продолжай исследовать :)",
];

export const BOOT_STEPS: readonly string[] = [
  "Accessing profile...",
  "Decrypting...",
  "Identity verified.",
  "Loading personnel file...",
];

export const QUOTE = {
  text: "Технологии — это инструмент. Важнее то, что мы создаём с их помощью.",
  author: "Tamirlan Z.",
} as const;

export const PROJECT = {
  name: "TamirlanOS",
  body: "Персональная операционная система-портфолио. Место, где технологии встречаются с эмоциями.",
  status: "IN PROGRESS",
  progress: 72,
} as const;
