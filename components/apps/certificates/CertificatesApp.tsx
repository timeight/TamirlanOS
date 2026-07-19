"use client";

import { BrandMark } from "@/components/ui/BrandMark";

const CERTIFICATES: readonly { subject: string; citation: string }[] = [
  {
    subject: "WorldSkills Kazakhstan",
    citation:
      "For participating in organizing and judging national professional skills competitions.",
  },
  {
    subject: "Teacher of Professional Disciplines",
    citation:
      "For teaching software development, programming, databases, mobile development and design — and mentoring students through their first real projects.",
  },
  {
    subject: "3D Artist",
    citation:
      "Since 2020: Blender, Maya, ZBrush and Substance Painter — from hard-surface modeling to final lighting and render.",
  },
  {
    subject: "Multidisciplinary Craft",
    citation:
      "For combining engineering, AI, design, motion and photography into products with their own personality.",
  },
  {
    subject: "TamirlanOS",
    citation:
      "For shipping an operating system as a portfolio — boot screen, window manager and all, one pixel at a time.",
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
              Tamirlan Studio certifies
            </p>
          </div>
          <p
            className="text-[16px] font-bold text-[#5a4a1a] italic"
            style={{ fontFamily: '"Trebuchet MS", Tahoma, sans-serif' }}
          >
            {certificate.subject}
          </p>
          <p className="mx-auto mt-1 max-w-[380px] leading-4 text-[#4a4a3a]">
            {certificate.citation}
          </p>
          <p className="mt-2 border-t border-[#d5c48a] pt-1.5 text-[10px] text-[#8f7a3a]">
            Awarded to Tamirlan Zhamalov · Kazakhstan
          </p>
        </div>
      ))}
    </div>
  );
}
