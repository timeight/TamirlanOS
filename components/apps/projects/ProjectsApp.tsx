"use client";

import { useState } from "react";
import { cn } from "@/core/utils/cn";

interface Project {
  id: string;
  name: string;
  summary: string;
  details: readonly string[];
  stack: string;
  grad: [string, string];
}

const PROJECTS: readonly Project[] = [
  {
    id: "tamirlanos",
    name: "TamirlanOS",
    summary:
      "Интерактивное портфолио в виде операционной системы в стиле Windows XP.",
    details: [
      "Цель: чтобы посетитель ощущал, будто загрузился в настоящую ОС, а не открыл сайт.",
      "Настоящий оконный менеджер (перетаскивание, ресайз, фокус, z-порядок), загрузка и вход, меню «Пуск», приложения и игры.",
      "Все иконки, обои и аватар — нарисованы вручную; вид Luna воссоздан на чистом CSS.",
    ],
    stack: "Next.js · React · TypeScript · Tailwind · zustand",
    grad: ["#6d28d9", "#4338ca"],
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
    grad: ["#0ea5e9", "#2563eb"],
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
    stack: "Computer Vision · оценка позы · iOS · Swift",
    grad: ["#e11d48", "#f97316"],
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
    stack: "DaVinci Resolve · моушн · брендинг · фото",
    grad: ["#059669", "#0d9488"],
  },
];

export function ProjectsApp() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto bg-[#0e0e13] p-4 text-slate-200">
      <h1 className="text-lg font-bold text-slate-100">Проекты</h1>
      <p className="mb-4 text-[12px] text-slate-400">
        Что я строю и чем горжусь.
      </p>
      <div className="grid gap-3 @sm:grid-cols-2">
        {PROJECTS.map((project) => {
          const tags = project.stack.split("·").map((tag) => tag.trim());
          const expanded = openId === project.id;
          return (
            <div
              key={project.id}
              className="overflow-hidden rounded-2xl border border-[#26262f] bg-[#16161d] transition-transform hover:-translate-y-0.5"
            >
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : project.id)}
                className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[#a78bfa]"
              >
                <div
                  className="flex h-16 items-end p-3 text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${project.grad[0]}, ${project.grad[1]})`,
                  }}
                >
                  <span className="text-base font-bold drop-shadow">
                    {project.name}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[12px] leading-4 text-slate-400">
                    {project.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#23232e] px-2 py-0.5 text-[10px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-2 inline-block text-[11px] font-semibold text-[#a78bfa]">
                    {expanded ? "Свернуть ▲" : "Подробнее ▼"}
                  </span>
                </div>
              </button>
              {expanded && (
                <ul className="space-y-1.5 border-t border-[#26262f] px-4 py-3 text-[12px] text-slate-400">
                  {project.details.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span
                        className={cn("mt-0.5 font-bold")}
                        style={{ color: project.grad[0] }}
                      >
                        •
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
