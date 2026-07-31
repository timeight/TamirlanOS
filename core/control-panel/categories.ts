export enum PanelCategory {
  Home = "home",
  Appearance = "appearance",
  Desktop = "desktop",
  Pix = "pix",
  Sound = "sound",
  Accessibility = "accessibility",
  System = "system",
  About = "about",
}

export interface CategoryDef {
  id: PanelCategory;
  title: string;
  blurb: string;
  /** Keywords the search box matches beyond the title. */
  terms: readonly string[];
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    id: PanelCategory.Appearance,
    title: "Оформление и темы",
    blurb: "Тема оформления, цвета окон",
    terms: ["тема", "luna", "classic", "dark", "цвет", "theme"],
  },
  {
    id: PanelCategory.Desktop,
    title: "Рабочий стол",
    blurb: "Значки, анимация, оформление стола",
    terms: ["обои", "значки", "иконки", "анимация", "wallpaper"],
  },
  {
    id: PanelCategory.Pix,
    title: "Помощник PIX",
    blurb: "Поведение и уровень дружбы",
    terms: ["pix", "пикс", "помощник", "питомец", "icq"],
  },
  {
    id: PanelCategory.Sound,
    title: "Звуки и аудио",
    blurb: "Громкость, системные звуки",
    terms: ["звук", "громкость", "audio", "mute", "тишина"],
  },
  {
    id: PanelCategory.Accessibility,
    title: "Специальные возможности",
    blurb: "Движение, контраст, размер текста",
    terms: ["контраст", "движение", "motion", "доступность", "текст"],
  },
  {
    id: PanelCategory.System,
    title: "Система",
    blurb: "Версия, модули, сброс параметров",
    terms: ["версия", "ядро", "kernel", "сброс", "экспорт", "импорт"],
  },
  {
    id: PanelCategory.About,
    title: "О системе TamirlanOS",
    blurb: "Сборка, технологии, благодарности",
    terms: ["о системе", "about", "credits", "версия"],
  },
];

export function searchCategories(query: string): readonly CategoryDef[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return CATEGORIES;
  return CATEGORIES.filter(
    (category) =>
      category.title.toLowerCase().includes(needle) ||
      category.blurb.toLowerCase().includes(needle) ||
      category.terms.some((term) => term.includes(needle)),
  );
}
