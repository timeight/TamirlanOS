"use client";

interface SkillBranch {
  name: string;
  skills: readonly string[];
}

const TREE: readonly SkillBranch[] = [
  {
    name: "Languages",
    skills: ["TypeScript · JavaScript", "Python · C#", "SQL", "Swift — учу"],
  },
  {
    name: "Frontend",
    skills: [
      "React · Next.js",
      "Tailwind CSS · CSS-анимации",
      "Адаптивная вёрстка · доступность",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js · REST API",
      "SQLite · SQL Server",
      "Git · GitHub · Docker",
    ],
  },
  {
    name: "AI",
    skills: [
      "Claude · GPT · Gemini",
      "Промпт-инжиниринг · structured output",
      "Компьютерное зрение · генеративный ИИ",
      "MCP · агентные сценарии",
    ],
  },
  {
    name: "Automation",
    skills: [
      "AI-пайплайны для контента",
      "Cursor · Claude Code",
      "Скрипты и интеграции под задачу",
    ],
  },
  {
    name: "Design",
    skills: [
      "UI · UX · веб-дизайн",
      "Фирменный стиль · презентации",
      "Типографика · теория цвета",
      "Figma · Photoshop · Illustrator",
    ],
  },
  {
    name: "3D & Motion",
    skills: [
      "Blender · Maya · ZBrush · Substance Painter",
      "Hard surface · скульптинг · продуктовая визуализация",
      "Свет · рендеринг · анимация",
      "Моушн-графика",
    ],
  },
  {
    name: "Photography & Video",
    skills: [
      "Fujifilm X-T2 · XF 35mm F2",
      "Стрит · портрет",
      "Цветокоррекция · плёночные симуляции",
      "DaVinci Resolve · подкасты · коммерческое видео",
    ],
  },
  {
    name: "Teaching",
    skills: [
      "Преподавание IT в колледже",
      "Менторство студенческих проектов",
      "WorldSkills Kazakhstan — организация и судейство",
    ],
  },
  {
    name: "Soft skills",
    skills: [
      "Самообучение · исследование",
      "Продуктовое мышление · внимание к деталям",
      "Коммуникация · работа в команде",
    ],
  },
];

export function SkillsApp() {
  return (
    <div className="h-full overflow-auto bg-white p-3 text-[11px] text-black">
      <p className="mb-2 text-[14px] font-bold text-[#003399]">Навыки</p>
      <p className="mb-3 text-[#4a5a70]">Только то, чем пользуюсь в работе.</p>
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
