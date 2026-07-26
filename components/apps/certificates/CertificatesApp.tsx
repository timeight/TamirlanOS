"use client";

import { BrandMark } from "@/components/ui/BrandMark";

const CERTIFICATES: readonly { subject: string; citation: string }[] = [
  {
    subject: "WorldSkills Kazakhstan",
    citation:
      "За участие в организации и судействе национальных чемпионатов профессионального мастерства.",
  },
  {
    subject: "Преподаватель профессиональных дисциплин",
    citation:
      "За преподавание разработки ПО, программирования, баз данных, мобильной разработки и дизайна — и наставничество студентов в их первых реальных проектах.",
  },
  {
    subject: "3D-художник",
    citation:
      "С 2020 года: Blender, Maya, ZBrush и Substance Painter — от hard-surface моделирования до финального света и рендера.",
  },
  {
    subject: "Мультидисциплинарное мастерство",
    citation:
      "За объединение инженерии, ИИ, дизайна, моушна и фотографии в продукты с собственным характером.",
  },
  {
    subject: "TamirlanOS",
    citation:
      "За выпуск операционной системы в виде портфолио — с экраном загрузки, оконным менеджером и всем прочим, пиксель за пикселем.",
  },
];

export function CertificatesApp() {
  return (
    <div className="h-full space-y-3 overflow-auto bg-[#ece9d8] p-3 text-[11px] text-black">
      {CERTIFICATES.map((certificate) => (
        <div
          key={certificate.subject}
          className="rounded-sm border-4 border-double border-[#b9a86a] bg-[#fffdf2] p-3 text-center shadow-sm"
        >
          <div className="mb-1 flex items-center justify-center gap-2">
            <BrandMark className="h-5 w-5" />
            <p className="text-[10px] tracking-[0.2em] text-[#8f7a3a] uppercase">
              Tamirlan Studio удостоверяет
            </p>
          </div>
          <p
            className="text-[16px] font-bold text-[#5a4a1a] italic"
            style={{ fontFamily: '"Trebuchet MS", Arial, sans-serif' }}
          >
            {certificate.subject}
          </p>
          <p className="mx-auto mt-1 max-w-[380px] leading-4 text-[#4a4a3a]">
            {certificate.citation}
          </p>
          <p className="mt-2 border-t border-[#d5c48a] pt-1.5 text-[10px] text-[#8f7a3a]">
            Выдано: Тамирлан Жамалов · Казахстан
          </p>
        </div>
      ))}
    </div>
  );
}
