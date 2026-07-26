export interface SoftwareItem {
  name: string;
  short: string;
  fg: string;
  bg: string;
}

// Hand-styled initial badges (not brand logo files) for the skills showcase.
export const SOFTWARE_PROGRAMS: readonly SoftwareItem[] = [
  { name: "Photoshop", short: "Ps", fg: "#31a8ff", bg: "#001e36" },
  { name: "Illustrator", short: "Ai", fg: "#ff9a00", bg: "#330000" },
  { name: "After Effects", short: "Ae", fg: "#9d9dff", bg: "#00005b" },
  { name: "Premiere Pro", short: "Pr", fg: "#c9b8ff", bg: "#2a0038" },
  { name: "Lightroom", short: "Lr", fg: "#31a8ff", bg: "#001e36" },
  { name: "Blender", short: "Bl", fg: "#ffffff", bg: "#e87d0d" },
  { name: "Maya", short: "Ma", fg: "#ffffff", bg: "#0a7d9c" },
  { name: "Substance Painter", short: "Sp", fg: "#ffffff", bg: "#d35400" },
  { name: "VS Code", short: "VS", fg: "#ffffff", bg: "#0a6cc0" },
  { name: "ChatGPT", short: "AI", fg: "#ffffff", bg: "#10a37f" },
  { name: "Claude", short: "Cl", fg: "#ffffff", bg: "#d97757" },
  { name: "Cursor", short: "Cu", fg: "#ffffff", bg: "#1e1e1e" },
  { name: "Notion", short: "N", fg: "#111111", bg: "#ffffff" },
  { name: "GitHub", short: "GH", fg: "#ffffff", bg: "#1b1f24" },
  { name: "Python", short: "Py", fg: "#ffd43b", bg: "#2b5b84" },
];
