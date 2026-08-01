export interface RoleCard {
  id: string;
  label: string;
  note: string;
}

export interface DiagnosticRow {
  key: string;
  value: string;
}

export interface DnaEntry {
  name: string;
  /** Filled cells out of 10. Derived from years of use, never invented. */
  level: number;
  since: number;
}

export interface Milestone {
  year: string;
  title: string;
  note: string;
}

export interface GearItem {
  id: string;
  label: string;
  caption: string;
}

export interface MemorySlot {
  id: string;
  label: string;
  tilt: number;
}

export const ROLE_CARDS: readonly RoleCard[] = [
  { id: "dev", label: "DEVELOPER", note: "фронтенд и системы" },
  { id: "3d", label: "3D ARTIST", note: "Blender, свет, форма" },
  { id: "photo", label: "PHOTOGRAPHER", note: "с 2019 года" },
  { id: "teacher", label: "TEACHER", note: "объясняю сложное просто" },
  { id: "ai", label: "AI BUILDER", note: "модели в продукте" },
  { id: "solver", label: "PROBLEM SOLVER", note: "сначала зачем, потом как" },
];

export const DIAGNOSTICS: readonly DiagnosticRow[] = [
  { key: "COUNTRY", value: "Kazakhstan" },
  { key: "EXPERIENCE", value: "Since 2020" },
  { key: "CURRENT STATUS", value: "Building TamirlanOS" },
  { key: "MISSION", value: "Create products people remember" },
  { key: "FOCUS", value: "AI · Photography · Software · Education" },
];

/** Levels track tenure, so nothing here claims more than the years support. */
export const TECH_DNA: readonly DnaEntry[] = [
  { name: "React", level: 9, since: 2021 },
  { name: "TypeScript", level: 9, since: 2021 },
  { name: "Python", level: 8, since: 2021 },
  { name: "AI / LLM", level: 8, since: 2023 },
  { name: "Photography", level: 9, since: 2019 },
  { name: "3D / Blender", level: 8, since: 2020 },
  { name: "Unity", level: 6, since: 2021 },
  { name: "UI Design", level: 8, since: 2020 },
  { name: "Prompt Engineering", level: 9, since: 2023 },
];

export const TIMELINE: readonly Milestone[] = [
  { year: "2019", title: "Камера", note: "первый кадр" },
  { year: "2020", title: "3D", note: "первый рендер до утра" },
  { year: "2021", title: "Код", note: "первая работающая программа" },
  { year: "2023", title: "Преподавание", note: "первое занятие" },
  { year: "2025", title: "ИИ", note: "модели в реальных задачах" },
  { year: "2026", title: "TamirlanOS", note: "операционная система" },
];

export const WORKSPACE_TAGS: readonly string[] = [
  "MacBook",
  "Camera",
  "Monitor",
  "Coffee",
  "Ideas",
];

export const GEAR: readonly GearItem[] = [
  { id: "fuji", label: "FUJIFILM", caption: "камера" },
  { id: "mac", label: "MACBOOK", caption: "рабочая машина" },
  { id: "iphone", label: "IPHONE", caption: "всегда в кармане" },
  { id: "audio", label: "HEADPHONES", caption: "тишина по требованию" },
];

export const MEMORY_WALL: readonly MemorySlot[] = [
  { id: "m1", label: "FIRST PROJECT", tilt: -3 },
  { id: "m2", label: "FIRST CAMERA", tilt: 2 },
  { id: "m3", label: "FIRST 3D MODEL", tilt: -1.5 },
  { id: "m4", label: "FIRST CLIENT", tilt: 2.5 },
  { id: "m5", label: "FIRST WEBSITE", tilt: -2 },
  { id: "m6", label: "CURRENT GOAL", tilt: 1.5 },
];

export const TERMINAL_LINES: readonly string[] = [
  "> tamirlanos build --release",
  "  compiling kernel ......... ok",
  "  linking managers ........ ok",
  "  waking pix .............. ok",
  "> everything OK",
];
