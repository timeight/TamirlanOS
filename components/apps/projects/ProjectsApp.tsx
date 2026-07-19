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
    summary: "Interactive operating-system portfolio inspired by Windows XP.",
    details: [
      "The goal: visitors should feel like they booted into a real operating system rather than opened a website.",
      "Real window manager (drag, resize, focus, z-order), boot and login lifecycle, Start menu, twelve applications.",
      "Every icon, the wallpaper and the avatar are hand-drawn SVG; the Luna look is recreated in pure CSS.",
    ],
    stack: "Next.js · React · TypeScript · Tailwind CSS · zustand",
  },
  {
    id: "cutai",
    name: "CutAI",
    summary: "AI-powered application for content creators.",
    details: [
      "Focus on automation, content creation and AI workflows.",
      "Built around modern LLM tooling and AI automation pipelines.",
      "In active development.",
    ],
    stack: "AI workflows · LLM APIs · automation",
  },
  {
    id: "iron-form",
    name: "IRON FORM",
    summary: "AI personal trainer that watches your form.",
    details: [
      "Uses camera pose estimation to analyze exercise technique.",
      "Planned as a future iOS application.",
      "Combines computer vision with coaching logic.",
    ],
    stack: "Computer vision · pose estimation · iOS (Swift, learning)",
  },
  {
    id: "creative",
    name: "Freelance Creative Work",
    summary: "Video, motion and brand work for clients.",
    details: [
      "Podcasts and commercial video production, edited in DaVinci Resolve.",
      "Motion graphics, graphic design, branding and marketing content.",
      "Social media content and photography.",
    ],
    stack: "DaVinci Resolve · motion design · branding · photography",
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
