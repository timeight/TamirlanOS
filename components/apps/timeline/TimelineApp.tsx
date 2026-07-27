"use client";

import { CyberShell } from "@/components/apps/cyber/CyberShell";
import { cn } from "@/core/utils/cn";

interface Entry {
  tag: string;
  phase: string;
  detail: string;
}

const ENTRIES: readonly Entry[] = [
  {
    tag: "ART://",
    phase: "2020 — Первый рендер",
    detail:
      "Начал с 3D: Blender, затем Maya, ZBrush и Substance Painter. Hard surface, продуктовая визуализация, скульптинг, свет и анимация.",
  },
  {
    tag: "WORK://",
    phase: "Фриланс / креатив",
    detail:
      "Подкасты, коммерческое видео, моушн-графика, брендинг, контент для соцсетей и фотография — DaVinci Resolve стал вторым домом.",
  },
  {
    tag: "EDU://",
    phase: "Преподаватель колледжа",
    detail:
      "Преподаватель профессиональных дисциплин: разработка ПО, программирование, базы данных, мобильная разработка и дизайн. Наставничество студентов.",
  },
  {
    tag: "EVENT://",
    phase: "WorldSkills Kazakhstan",
    detail:
      "Участвовал в организации и судействе национальных чемпионатов по профессиональному мастерству.",
  },
  {
    tag: "AI://",
    phase: "Поворот к ИИ",
    detail:
      "Создание приложений с ИИ на Gemini, Claude и OpenAI: автоматизация, компьютерное зрение, генеративный ИИ, промпт-инжиниринг.",
  },
  {
    tag: "BUILD://",
    phase: "CutAI и IRON FORM",
    detail:
      "CutAI — AI-процессы для создания контента. IRON FORM — AI-тренер на основе оценки позы по камере, движется к iOS.",
  },
  {
    tag: "OS://",
    phase: "2026 — TamirlanOS",
    detail:
      "Эта операционная система: портфолио, в которое загружаешься, собранное вручную пиксель за пикселем. Цель — софт, который запоминают.",
  },
];

export function TimelineApp() {
  const total = String(ENTRIES.length).padStart(2, "0");

  return (
    <CyberShell heading="My Journey" section="03 JOURNEY">
      <ol className="relative">
        {ENTRIES.map((entry, index) => {
          const left = index % 2 === 0;
          const current = index === ENTRIES.length - 1;
          const accent = current ? "#c6f24e" : "#5fd4ff";
          return (
            <li key={entry.phase} className="relative pb-9 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-3 bottom-0 left-[7px] w-px bg-[#1b2740] @[560px]:left-1/2 @[560px]:-translate-x-1/2"
              />
              <span
                aria-hidden="true"
                className="bg-cyber-bg absolute top-1.5 left-[2px] h-3 w-3 rotate-45 border @[560px]:left-1/2 @[560px]:-translate-x-1/2"
                style={{
                  borderColor: accent,
                  boxShadow: `0 0 10px ${accent}66`,
                }}
              />
              <span
                className={cn(
                  "absolute top-1.5 hidden text-[10px] tracking-[0.2em] text-slate-600 @[560px]:block",
                  left ? "left-1/2 ml-7" : "right-1/2 mr-7",
                )}
              >
                {String(index + 1).padStart(2, "0")} / {total}
              </span>
              <div
                className={cn(
                  "ml-7 border border-[#1b2740] bg-[#0c1422] p-3 @[560px]:ml-0 @[560px]:w-[calc(50%-1.75rem)]",
                  left
                    ? "@[560px]:mr-auto @[560px]:text-right"
                    : "@[560px]:ml-auto",
                )}
              >
                <p
                  className="mb-1 text-[10px] tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  {entry.tag}
                </p>
                <p className="text-[13px] font-bold text-slate-100">
                  {entry.phase}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  {entry.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </CyberShell>
  );
}
