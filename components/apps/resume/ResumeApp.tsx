"use client";

import { asset } from "@/core/config/base-path";

const EMAIL = "tamirlanzhamalov@gmail.com";
const RESUME_PDF = asset("/assets/resume/Tamirlan_Zhamalov_CV.pdf");

const SECTIONS: readonly { title: string; lines: readonly string[] }[] = [
  {
    title: "Профиль",
    lines: [
      "Мультидисциплинарный создатель из Казахстана, 25 лет: разработчик, AI-инженер, 3D-художник, моушн-дизайнер и преподаватель.",
      "Создаю продукты, которые ощущаются сделанными вручную — впечатления, которые запоминают, а не обычные приложения.",
    ],
  },
  {
    title: "Опыт — преподаватель колледжа",
    lines: [
      "Преподаватель профессиональных дисциплин: разработка ПО, программирование, базы данных, мобильная разработка и дизайн.",
      "Наставничество студентов, помощь в подготовке проектов, организация чемпионатов.",
      "WorldSkills Kazakhstan — участие в организации и судействе чемпионатов.",
    ],
  },
  {
    title: "Опыт — фриланс / креатив",
    lines: [
      "Подкасты, видеопродакшн и коммерческое видео.",
      "Моушн-графика, графический дизайн, брендинг и маркетинговый контент.",
      "Контент для соцсетей и фотография.",
    ],
  },
  {
    title: "Текущие проекты",
    lines: [
      "TamirlanOS — это интерактивное портфолио-ОС (Next.js, React, TypeScript, Tailwind, zustand).",
      "CutAI — приложение с ИИ для автоматизации, создания контента и AI-процессов.",
      "IRON FORM — AI-тренер на основе оценки позы по камере; будущее iOS-приложение.",
    ],
  },
  {
    title: "Образование",
    lines: [
      "Интернет вещей, Big Data, программирование, базы данных, компьютерные сети, разработка ПО.",
    ],
  },
  {
    title: "Инструменты",
    lines: [
      "Visual Studio · VS Code · Cursor · Claude Code · Git · GitHub · Docker",
      "Figma · Photoshop · Illustrator · Blender · Maya · Substance Painter · Unity · DaVinci Resolve",
    ],
  },
  {
    title: "Языки",
    lines: ["Казахский · русский · английский (улучшаю) · арабский (изучаю)"],
  },
  {
    title: "Контакты",
    lines: [`Email: ${EMAIL}`, "Локация: Казахстан"],
  },
];

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2.5">
        <div>
          <p className="text-[15px] font-bold text-[#003399]">
            Тамирлан Жамалов
          </p>
          <p className="text-[#4a5a70]">
            Разработчик · AI-инженер · преподаватель
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Открыть CV (PDF)
          </a>
          <a
            href={RESUME_PDF}
            download
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Скачать
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Нанять меня
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        {SECTIONS.map((section) => (
          <details
            key={section.title}
            open
            className="mb-2 rounded-sm border border-[#aca899] bg-[#f7fafd]"
          >
            <summary className="cursor-pointer bg-[#ebf3fb] px-2 py-1 font-bold select-none">
              {section.title}
            </summary>
            <ul className="space-y-1.5 py-2 pr-3 pl-6">
              {section.lines.map((line) => (
                <li key={line} className="list-disc leading-4">
                  {line}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
