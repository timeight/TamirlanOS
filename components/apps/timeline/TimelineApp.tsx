"use client";

const ENTRIES: readonly { phase: string; detail: string }[] = [
  {
    phase: "2020 — Первый рендер",
    detail:
      "Начал с 3D: Blender, затем Maya, ZBrush и Substance Painter. Hard surface, продуктовая визуализация, скульптинг, свет и анимация.",
  },
  {
    phase: "Фриланс / креатив",
    detail:
      "Подкасты, коммерческое видео, моушн-графика, брендинг, контент для соцсетей и фотография — DaVinci Resolve стал вторым домом.",
  },
  {
    phase: "Преподаватель колледжа",
    detail:
      "Преподаватель профессиональных дисциплин: разработка ПО, программирование, базы данных, мобильная разработка и дизайн. Наставничество студентов и их проектов.",
  },
  {
    phase: "WorldSkills Kazakhstan",
    detail:
      "Участвовал в организации и судействе национальных чемпионатов по профессиональному мастерству.",
  },
  {
    phase: "Поворот к ИИ",
    detail:
      "Создание приложений с ИИ на Gemini, Claude и OpenAI: автоматизация, компьютерное зрение, генеративный ИИ, промпт-инжиниринг.",
  },
  {
    phase: "CutAI и IRON FORM",
    detail:
      "CutAI — AI-процессы для создания контента. IRON FORM — AI-тренер на основе оценки позы по камере, движется к iOS.",
  },
  {
    phase: "2026 — TamirlanOS",
    detail:
      "Эта операционная система: портфолио, в которое загружаешься, собранное вручную пиксель за пикселем. Цель — софт, который запоминают.",
  },
];

export function TimelineApp() {
  return (
    <div className="h-full overflow-auto bg-white p-3 text-[11px] text-black">
      <p className="text-[14px] font-bold text-[#003399]">Хронология</p>
      <p className="mt-0.5 mb-3 text-[#4a5a70]">
        От первого рендера в Blender до собственной операционной системы.
      </p>
      <ol className="relative ml-2 border-l-2 border-[#7da2ce] pl-4">
        {ENTRIES.map((entry) => (
          <li key={entry.phase} className="relative mb-3.5">
            <span
              aria-hidden="true"
              className="absolute top-0.5 -left-[23px] h-3 w-3 rounded-full border-2 border-[#316ac5] bg-[#ebf3fb]"
            />
            <p className="font-bold">{entry.phase}</p>
            <p className="mt-0.5 leading-4 text-[#333]">{entry.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
