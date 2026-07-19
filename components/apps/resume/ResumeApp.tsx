"use client";

import { asset } from "@/core/config/base-path";

const EMAIL = "tamirlanzhamalov@gmail.com";
const RESUME_PDF = asset("/assets/resume/Tamirlan_Zhamalov_CV.pdf");

const SECTIONS: readonly { title: string; lines: readonly string[] }[] = [
  {
    title: "Profile",
    lines: [
      "Multidisciplinary creator from Kazakhstan, 25: software developer, AI engineer, 3D artist, motion designer and teacher.",
      "I build products that feel handcrafted — experiences people remember, not ordinary applications.",
    ],
  },
  {
    title: "Experience — College Teacher",
    lines: [
      "Teacher of Professional Disciplines: software development, programming, databases, mobile development and design.",
      "Mentoring students, helping them prepare projects, organizing competitions.",
      "WorldSkills Kazakhstan — participated in organizing and judging competitions.",
    ],
  },
  {
    title: "Experience — Freelance Creative",
    lines: [
      "Podcasts, video production and commercial video.",
      "Motion graphics, graphic design, branding and marketing content.",
      "Social media content and photography.",
    ],
  },
  {
    title: "Current projects",
    lines: [
      "TamirlanOS — this interactive operating-system portfolio (Next.js, React, TypeScript, Tailwind, zustand).",
      "CutAI — AI-powered application for automation, content creation and AI workflows.",
      "IRON FORM — AI personal trainer using camera pose estimation; future iOS application.",
    ],
  },
  {
    title: "Education",
    lines: [
      "Internet of Things, Big Data, programming, databases, computer networks, software development.",
    ],
  },
  {
    title: "Tools",
    lines: [
      "Visual Studio · VS Code · Cursor · Claude Code · Git · GitHub · Docker",
      "Figma · Photoshop · Illustrator · Blender · Maya · Substance Painter · Unity · DaVinci Resolve",
    ],
  },
  {
    title: "Languages",
    lines: ["Kazakh · Russian · English (improving) · Arabic (learning)"],
  },
  {
    title: "Contact",
    lines: [`Email: ${EMAIL}`, "Location: Kazakhstan"],
  },
];

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2.5">
        <div>
          <p className="text-[15px] font-bold text-[#003399]">
            Tamirlan Zhamalov
          </p>
          <p className="text-[#4a5a70]">
            Software Developer · AI Engineer · Teacher
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            View CV (PDF)
          </a>
          <a
            href={RESUME_PDF}
            download
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Download
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
          >
            Hire me
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
