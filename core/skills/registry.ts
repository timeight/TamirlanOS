export interface RegistryValue {
  name: string;
  data: string;
  since?: number;
}

export interface RegistryKey {
  id: string;
  label: string;
  values: readonly RegistryValue[];
}

/** Everything is dated from the year the work actually started, not a self-rating. */
export const SKILL_KEYS: readonly RegistryKey[] = [
  {
    id: "languages",
    label: "Languages",
    values: [
      { name: "TypeScript", data: "ежедневно", since: 2022 },
      { name: "JavaScript", data: "ежедневно", since: 2020 },
      { name: "Python", data: "автоматизация, ИИ", since: 2020 },
      { name: "C#", data: "десктоп, Unity", since: 2020 },
      { name: "SQL", data: "проектирование БД", since: 2021 },
      { name: "Swift", data: "изучаю", since: 2025 },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    values: [
      { name: "React", data: "основной инструмент", since: 2022 },
      { name: "Next.js", data: "App Router, SSG", since: 2023 },
      { name: "Tailwind CSS", data: "дизайн-система", since: 2023 },
      { name: "CSS-анимации", data: "без библиотек", since: 2021 },
      { name: "Доступность", data: "WCAG 2.1 AA", since: 2024 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    values: [
      { name: "Node.js", data: "API и скрипты", since: 2022 },
      { name: "REST API", data: "проектирование", since: 2021 },
      { name: "SQLite", data: "локальные данные", since: 2021 },
      { name: "SQL Server", data: "учебные проекты", since: 2021 },
      { name: "Docker", data: "окружения", since: 2023 },
      { name: "Git · GitHub", data: "ежедневно", since: 2020 },
    ],
  },
  {
    id: "ai",
    label: "AI",
    values: [
      { name: "Claude", data: "ежедневно", since: 2024 },
      { name: "GPT", data: "ежедневно", since: 2023 },
      { name: "Gemini", data: "продакшн-задачи", since: 2024 },
      { name: "Промпт-инжиниринг", data: "ключевой навык", since: 2023 },
      { name: "Structured output", data: "интеграции", since: 2024 },
      { name: "Computer vision", data: "оценка позы", since: 2025 },
      { name: "MCP · агенты", data: "активно", since: 2025 },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    values: [
      { name: "AI-пайплайны", data: "контент и медиа", since: 2024 },
      { name: "Cursor", data: "ежедневно", since: 2024 },
      { name: "Claude Code", data: "ежедневно", since: 2025 },
      { name: "Скрипты", data: "под задачу", since: 2020 },
    ],
  },
  {
    id: "design",
    label: "Design",
    values: [
      { name: "UI-дизайн", data: "продукты и сайты", since: 2021 },
      { name: "UX", data: "исследование, потоки", since: 2022 },
      { name: "Figma", data: "основной инструмент", since: 2021 },
      { name: "Photoshop", data: "с 2019", since: 2019 },
      { name: "Illustrator", data: "вектор, айдентика", since: 2020 },
      { name: "Типографика", data: "и теория цвета", since: 2020 },
    ],
  },
  {
    id: "3d",
    label: "3D & Motion",
    values: [
      { name: "Blender", data: "основной пакет", since: 2020 },
      { name: "Maya", data: "анимация", since: 2021 },
      { name: "ZBrush", data: "скульптинг", since: 2021 },
      { name: "Substance Painter", data: "текстуры", since: 2021 },
      { name: "Hard surface", data: "продуктовая визуализация", since: 2020 },
      { name: "Свет · рендер", data: "Cycles, Arnold", since: 2020 },
      { name: "Моушн-графика", data: "заставки, титры", since: 2021 },
    ],
  },
  {
    id: "photo",
    label: "Photography & Video",
    values: [
      { name: "Fujifilm X-T2", data: "XF 35mm F2", since: 2019 },
      { name: "Стрит · портрет", data: "личные проекты", since: 2019 },
      { name: "Цветокоррекция", data: "плёночные симуляции", since: 2020 },
      { name: "DaVinci Resolve", data: "монтаж и грейд", since: 2020 },
      { name: "Подкасты", data: "съёмка и постпродакшн", since: 2021 },
      { name: "Коммерческое видео", data: "клиентские проекты", since: 2021 },
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    values: [
      { name: "Преподавание IT", data: "колледж", since: 2023 },
      { name: "Менторство", data: "студенческие проекты", since: 2023 },
      { name: "WorldSkills KZ", data: "организация, судейство", since: 2023 },
    ],
  },
  {
    id: "soft",
    label: "Soft skills",
    values: [
      { name: "Самообучение", data: "главный навык" },
      { name: "Исследование", data: "разбор новых тем" },
      { name: "Продуктовое мышление", data: "зачем, а потом как" },
      { name: "Внимание к деталям", data: "до пикселя" },
      { name: "Коммуникация", data: "команда и клиенты" },
    ],
  },
];

export function yearsOfUse(since: number, now: number): number {
  return Math.max(1, now - since);
}
