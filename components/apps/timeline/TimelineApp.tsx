"use client";

const ENTRIES: readonly { phase: string; detail: string }[] = [
  {
    phase: "2020 — First render",
    detail:
      "Started 3D: Blender, then Maya, ZBrush and Substance Painter. Hard surface, product visualization, sculpting, lighting and animation.",
  },
  {
    phase: "Freelance creative",
    detail:
      "Podcasts, commercial video, motion graphics, branding, social media content and photography — DaVinci Resolve became a second home.",
  },
  {
    phase: "College teacher",
    detail:
      "Teacher of Professional Disciplines: software development, programming, databases, mobile development and design. Mentoring students and their projects.",
  },
  {
    phase: "WorldSkills Kazakhstan",
    detail:
      "Participated in organizing and judging national skills competitions.",
  },
  {
    phase: "The AI turn",
    detail:
      "Building AI-powered applications with Gemini, Claude and OpenAI: automation, computer vision, generative AI, prompt engineering.",
  },
  {
    phase: "CutAI & IRON FORM",
    detail:
      "CutAI — AI workflows for content creation. IRON FORM — an AI personal trainer built on camera pose estimation, heading to iOS.",
  },
  {
    phase: "2026 — TamirlanOS",
    detail:
      "This operating system: a portfolio you boot into, hand-built pixel by pixel. The goal — software people remember.",
  },
];

export function TimelineApp() {
  return (
    <div className="h-full overflow-auto bg-white p-3 text-[11px] text-black">
      <p className="text-[14px] font-bold text-[#003399]">Timeline</p>
      <p className="mt-0.5 mb-3 text-[#4a5a70]">
        From the first Blender render to an operating system of my own.
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
