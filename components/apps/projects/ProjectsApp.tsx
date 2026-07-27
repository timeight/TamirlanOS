"use client";

import { useState } from "react";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { CyberShell } from "@/components/apps/cyber/CyberShell";

interface Project {
  id: string;
  name: string;
  status: string;
  summary: string;
  details: readonly string[];
  stack: string;
}

const PROJECTS: readonly Project[] = [
  {
    id: "tamirlanos",
    name: "TamirlanOS",
    status: "LIVE",
    summary:
      "Интерактивное портфолио в виде операционной системы в стиле Windows XP.",
    details: [
      "Цель: чтобы посетитель ощущал, будто загрузился в настоящую ОС, а не открыл сайт.",
      "Настоящий оконный менеджер (перетаскивание, ресайз, фокус, z-порядок), загрузка и вход, меню «Пуск», приложения и игры.",
      "Все иконки, обои и аватар — нарисованы вручную; вид Luna воссоздан на чистом CSS.",
    ],
    stack: "Next.js · React · TypeScript · Tailwind · zustand",
  },
  {
    id: "cutai",
    name: "CutAI",
    status: "WIP",
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
    status: "WIP",
    summary: "AI-тренер, который следит за твоей техникой.",
    details: [
      "Использует оценку позы по камере для анализа техники упражнений.",
      "Планируется как будущее iOS-приложение.",
      "Объединяет компьютерное зрение с логикой тренера.",
    ],
    stack: "Computer Vision · оценка позы · iOS · Swift",
  },
  {
    id: "creative",
    name: "Фриланс / креатив",
    status: "ONGOING",
    summary: "Видео, моушн и брендинг для клиентов.",
    details: [
      "Подкасты и коммерческое видео, монтаж в DaVinci Resolve.",
      "Моушн-графика, графический дизайн, брендинг и маркетинговый контент.",
      "Контент для соцсетей и фотография.",
    ],
    stack: "DaVinci Resolve · моушн · брендинг · фото",
  },
];

export function ProjectsApp() {
  const [openId, setOpenId] = useState<string | null>(PROJECTS[0]?.id ?? null);

  return (
    <CyberShell heading="Selected Work" section="02 WORK">
      <div className="mb-3 grid grid-cols-[2rem_1fr_auto] gap-3 border-b border-[#1b2740] pb-2 text-[10px] tracking-[0.2em] text-slate-500">
        <span>#</span>
        <span>PROJECT</span>
        <span>STATUS</span>
      </div>
      <div className="divide-y divide-[#141d31]">
        {PROJECTS.map((project, index) => {
          const expanded = openId === project.id;
          const tags = project.stack.split("·").map((tag) => tag.trim());
          return (
            <div key={project.id}>
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : project.id)}
                aria-expanded={expanded}
                className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 py-3 text-left transition-colors hover:bg-[#0e1728] focus-visible:bg-[#0e1728] focus-visible:outline-none"
              >
                <span className="text-cyber-cyan text-[11px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold tracking-wide text-slate-100">
                    {project.name}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {project.summary}
                  </span>
                </span>
                <span className="text-cyber-lime text-[9px] tracking-[0.15em]">
                  [{project.status}]
                </span>
              </button>
              {expanded && (
                <CornerFrame className="mb-3 bg-[#0c1422] p-4">
                  <ul className="space-y-1.5 text-[12px] leading-5 text-slate-400">
                    {project.details.map((line) => (
                      <li key={line}>
                        <span className="text-cyber-cyan">{"// "}</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-[#1b2740] pt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[#22314f] px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CornerFrame>
              )}
            </div>
          );
        })}
      </div>
    </CyberShell>
  );
}
