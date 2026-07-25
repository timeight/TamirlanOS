"use client";

interface SkillBranch {
  name: string;
  skills: readonly string[];
}

const TREE: readonly SkillBranch[] = [
  {
    name: "Языки",
    skills: ["Python · C# · SQL", "JavaScript · TypeScript", "Swift (изучаю)"],
  },
  {
    name: "Фреймворки и платформы",
    skills: [
      "React · Next.js",
      "Unity (разработка игр) · Windows Forms (десктоп)",
      "SQLite · SQL Server",
    ],
  },
  {
    name: "ИИ",
    skills: [
      "Gemini · Claude · OpenAI",
      "Cursor · Claude Code · MCP",
      "AI-автоматизация · промпт-инжиниринг",
      "Компьютерное зрение · генеративный ИИ · генерация изображений и видео",
    ],
  },
  {
    name: "3D — с 2020",
    skills: [
      "Blender · Maya · ZBrush · Substance Painter",
      "Hard surface · продуктовая визуализация · скульптинг",
      "Анимация · свет · рендеринг",
    ],
  },
  {
    name: "Дизайн",
    skills: [
      "UI-дизайн · UX · веб-дизайн",
      "Графический дизайн · фирменный стиль · дизайн презентаций",
      "Моушн-дизайн · теория цвета",
    ],
  },
  {
    name: "Фото и видео",
    skills: [
      "Fujifilm X-T2 с XF 35mm F2",
      "Стрит · портрет · кинематографичная съёмка",
      "Плёночные симуляции · цветокоррекция",
      "DaVinci Resolve · коммерческое видео · продакшн подкастов",
    ],
  },
  {
    name: "Инструменты",
    skills: [
      "Visual Studio · VS Code · Cursor · Claude Code",
      "Git · GitHub · Docker",
      "Figma · Photoshop · Illustrator",
    ],
  },
  {
    name: "Гибкие навыки",
    skills: [
      "Преподавание · менторство · лидерство · коммуникация",
      "Решение задач · исследование · самообучение",
      "Внимание к деталям · продуктовое мышление",
    ],
  },
];

export function SkillsApp() {
  return (
    <div className="h-full overflow-auto bg-white p-3 text-[11px] text-black">
      <p className="mb-2 text-[14px] font-bold text-[#003399]">
        Дерево технологий
      </p>
      <p className="mb-3 text-[#4a5a70]">
        Программирование, ИИ, 3D, дизайн, фото и видео — один набор
        инструментов.
      </p>
      {TREE.map((branch) => (
        <details
          key={branch.name}
          open
          className="mb-2 rounded-sm border border-[#aca899] bg-[#f7fafd]"
        >
          <summary className="cursor-pointer bg-[#ebf3fb] px-2 py-1 font-bold select-none">
            {branch.name}
          </summary>
          <ul className="space-y-1 py-2 pr-2 pl-6">
            {branch.skills.map((skill) => (
              <li key={skill} className="list-disc leading-4">
                {skill}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
