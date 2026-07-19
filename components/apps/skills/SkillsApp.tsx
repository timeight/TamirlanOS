"use client";

interface SkillBranch {
  name: string;
  skills: readonly string[];
}

const TREE: readonly SkillBranch[] = [
  {
    name: "Languages",
    skills: [
      "Python · C# · SQL",
      "JavaScript · TypeScript",
      "Swift (learning)",
    ],
  },
  {
    name: "Frameworks & platforms",
    skills: [
      "React · Next.js",
      "Unity (game development) · Windows Forms (desktop)",
      "SQLite · SQL Server",
    ],
  },
  {
    name: "AI",
    skills: [
      "Gemini · Claude · OpenAI",
      "Cursor · Claude Code · MCP",
      "AI automation · prompt engineering",
      "Computer vision · generative AI · image and video generation",
    ],
  },
  {
    name: "3D — since 2020",
    skills: [
      "Blender · Maya · ZBrush · Substance Painter",
      "Hard surface · product visualization · sculpting",
      "Animation · lighting · rendering",
    ],
  },
  {
    name: "Design",
    skills: [
      "UI design · UX · web design",
      "Graphic design · brand identity · presentation design",
      "Motion design · color theory",
    ],
  },
  {
    name: "Photo & video",
    skills: [
      "Fujifilm X-T2 with XF 35mm F2",
      "Street · portrait · cinematic photography",
      "Film simulations · color grading",
      "DaVinci Resolve · commercial video · podcast production",
    ],
  },
  {
    name: "Tools",
    skills: [
      "Visual Studio · VS Code · Cursor · Claude Code",
      "Git · GitHub · Docker",
      "Figma · Photoshop · Illustrator",
    ],
  },
  {
    name: "Soft skills",
    skills: [
      "Teaching · mentoring · leadership · communication",
      "Problem solving · research · self-learning",
      "Attention to detail · product thinking",
    ],
  },
];

export function SkillsApp() {
  return (
    <div className="h-full overflow-auto bg-white p-3 text-[11px] text-black">
      <p className="mb-2 text-[14px] font-bold text-[#003399]">
        Technology tree
      </p>
      <p className="mb-3 text-[#4a5a70]">
        Software engineering, AI, 3D, design, photo and video — one toolbox.
      </p>
      {TREE.map((branch) => (
        <details
          key={branch.name}
          open
          className="mb-2 rounded-sm border border-[#aca899] bg-[#f7fafd]"
        >
          <summary className="cursor-pointer bg-[#ebf3fb] px-2 py-1 font-bold select-none">
            {branch.name}
          </summary>
          <ul className="space-y-1 py-2 pr-2 pl-6">
            {branch.skills.map((skill) => (
              <li key={skill} className="list-disc leading-4">
                {skill}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
