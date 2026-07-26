export interface SoftwareItem {
  name: string;
  short: string;
  fg: string;
  bg: string;
  icon?: string;
}

// Items with a real logo file (added by the owner) render that image; the rest fall
// back to a hand-styled initial badge.
export const SOFTWARE_PROGRAMS: readonly SoftwareItem[] = [
  { name: "Photoshop", short: "Ps", fg: "#31a8ff", bg: "#001e36" },
  { name: "Illustrator", short: "Ai", fg: "#ff9a00", bg: "#330000" },
  { name: "After Effects", short: "Ae", fg: "#9d9dff", bg: "#00005b" },
  { name: "Premiere Pro", short: "Pr", fg: "#c9b8ff", bg: "#2a0038" },
  { name: "Lightroom", short: "Lr", fg: "#31a8ff", bg: "#001e36" },
  {
    name: "Blender",
    short: "Bl",
    fg: "#ffffff",
    bg: "#e87d0d",
    icon: "/assets/icons/Blender_logo_no_text.svg.webp",
  },
  {
    name: "Maya",
    short: "Ma",
    fg: "#ffffff",
    bg: "#0a7d9c",
    icon: "/assets/icons/autodesk-maya-logo-png_seeklogo-482401.png",
  },
  {
    name: "Substance Painter",
    short: "Sp",
    fg: "#ffffff",
    bg: "#d35400",
    icon: "/assets/icons/adobe-substance-3d-logo-png_seeklogo-526401.png",
  },
  {
    name: "VS Code",
    short: "VS",
    fg: "#ffffff",
    bg: "#0a6cc0",
    icon: "/assets/icons/Visual_Studio_Code_1.35_icon.svg.webp",
  },
  {
    name: "ChatGPT",
    short: "AI",
    fg: "#ffffff",
    bg: "#10a37f",
    icon: "/assets/icons/ChatGPT-Logo.svg.webp",
  },
  {
    name: "Claude",
    short: "Cl",
    fg: "#ffffff",
    bg: "#d97757",
    icon: "/assets/icons/claude-logo-png_seeklogo-554534.png",
  },
  {
    name: "Cursor",
    short: "Cu",
    fg: "#ffffff",
    bg: "#1e1e1e",
    icon: "/assets/icons/Cursor_Vector_Logo.png",
  },
  {
    name: "Notion",
    short: "N",
    fg: "#111111",
    bg: "#ffffff",
    icon: "/assets/icons/Notion_app_logo.png",
  },
  {
    name: "GitHub",
    short: "GH",
    fg: "#ffffff",
    bg: "#1b1f24",
    icon: "/assets/icons/Octicons-mark-github.svg",
  },
  {
    name: "Python",
    short: "Py",
    fg: "#ffd43b",
    bg: "#2b5b84",
    icon: "/assets/icons/Python-logo-notext.svg.webp",
  },
];
