"use client";

import { useState } from "react";
import { cn } from "@/core/utils/cn";

interface Project {
  id: string;
  name: string;
  summary: string;
  details: readonly string[];
  stack: string;
}

const PROJECTS: readonly Project[] = [
  {
    id: "tamirlanos",
    name: "TamirlanOS",
    summary:
      "Интерактивное портфолио в виде операционной системы в стиле Windows XP.",
    details: [
      "Цель: чтобы посетитель ощущал, будто загрузился в настоящую ОС, а не открыл сайт.",
      "Настоящий оконный менеджер (перетаскивание, ресайз, фокус, z-порядок), загрузка и вход, меню «Пуск», двенадцать приложений.",
      "Все иконки, обои и аватар — нарисованы вручную в SVG; вид Luna воссоздан на чистом CSS.",
    ],
    stack: "Next.js · React · TypeScript · Tailwind CSS · zustand",
  },
  {
    id: "cutai",
    name: "CutAI",
    summary: "Приложение с ИИ для создателей контента.",
    details: [
      "Фокус на автоматизации, создании контента и AI-процессах.",
      "Построено вокруг современных LLM-инструментов и пайплайнов автоматизации.",
      "В активной разработке.",
    ],
    stack: "AI-процессы · LLM API · автоматизация",
  },
  {
    id: "iron-form",
    name: "IRON FORM",
    summary: "AI-тренер, который следит за твоей техникой.",
    details: [
      "Использует оценку позы по камере для анализа техники упражнений.",
      "Планируется как будущее iOS-приложение.",
      "Объединяет компьютерное зрение с логикой тренера.",
    ],
    stack: "Компьютерное зрение · оценка позы · iOS (Swift, изучаю)",
  },
  {
    id: "creative",
    name: "Фриланс / креатив",
    summary: "Видео, моушн и брендинг для клиентов.",
    details: [
      "Подкасты и коммерческое видео, монтаж в DaVinci Resolve.",
      "Моушн-графика, графический дизайн, брендинг и маркетинговый контент.",
      "Контент для соцсетей и фотография.",
    ],
    stack: "DaVinci Resolve · моушн-дизайн · брендинг · фотография",
  },
];

export function ProjectsApp() {
  const [selectedId, setSelectedId] = useState<string>(() => {
    const first = PROJECTS[0];
    return first ? first.id : "";
  });
  const selected = PROJECTS.find((project) => project.id === selectedId);

  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black @sm:flex-row">
      <ul className="max-h-32 w-full shrink-0 overflow-auto border-b border-[#aca899] bg-[#ebf3fb] py-1 @sm:max-h-none @sm:w-44 @sm:border-r @sm:border-b-0">
        {PROJECTS.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => setSelectedId(project.id)}
              className={cn(
                "w-full px-2 py-1 text-left",
                project.id === selectedId
                  ? "bg-xp-selection text-white"
                  : "hover:bg-[#d6e6f8]",
              )}
            >
              {project.name}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="flex-1 overflow-auto p-3">
          <p className="text-[14px] font-bold text-[#003399]">
            {selected.name}
          </p>
          <p className="mt-1 text-[#4a5a70]">{selected.summary}</p>
          <ul className="mt-3 list-disc space-y-1 pl-4 leading-4">
            {selected.details.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-3 border-t border-[#d8d5c4] pt-2 text-[#4a5a70]">
            {selected.stack}
          </p>
        </div>
      )}
    </div>
  );
}
