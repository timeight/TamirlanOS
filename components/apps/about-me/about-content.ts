export const SKILLS: readonly string[] = [
  "Full Stack",
  "Искусственный интеллект",
  "AI-автоматизация",
  "Промпт-инжиниринг",
  "UI / UX",
  "Веб-дизайн",
  "3D-графика",
  "Моушн-дизайн",
  "Фотография",
  "Преподавание",
];

export const SOFTWARE: readonly string[] = [
  "TypeScript · React · Next.js",
  "Python · C#",
  "Claude · GPT · Gemini",
  "Blender · Maya · ZBrush",
  "Figma · Photoshop",
  "DaVinci Resolve",
];

export interface BioSection {
  heading: string;
  body: string;
}

export const BIO_SECTIONS: readonly BioSection[] = [
  {
    heading: "Profile",
    body: "Разработчик и цифровой создатель из Казахстана. Пишу код, работаю с ИИ, проектирую интерфейсы и снимаю. Для меня это не разные профессии, а один процесс.",
  },
  {
    heading: "My approach",
    body: "Начал с 3D. Потом пришло программирование. Потом ИИ. Сегодня всё это работает вместе. Беру технологию, разбираюсь и сразу применяю в реальном проекте — иначе не запоминается.",
  },
  {
    heading: "What I do",
    body: "Full stack, ИИ и автоматизация, промпт-инжиниринг, UI/UX и веб-дизайн, 3D, моушн, фотография. Преподаю IT — объяснять умею не хуже, чем делать.",
  },
  {
    heading: "Philosophy",
    body: "Технологии решают задачи. Дизайн упрощает сложное. ИИ экономит время. Хороший софт незаметен. Отличный — вызывает эмоцию.",
  },
  {
    heading: "Goal",
    body: "Делать продукты, которыми приятно пользоваться. Учиться дальше. Лучше меньше, но со смыслом.",
  },
];
