import type { VkGlyphName } from "@/core/vk/glyphs";
import { VK_SECTION, type VkSection } from "@/core/vk/sections";

export interface VkNavEntry {
  section: VkSection;
  glyph: VkGlyphName;
  /** Короткая подпись для нижней полосы; в drawer печатается полное имя. */
  short: string;
}

/** Порядок пунктов повторяет боковое меню приложения тех лет. */
export const VK_DRAWER: readonly VkNavEntry[] = [
  { section: VK_SECTION.profile, glyph: "news", short: "Страница" },
  { section: VK_SECTION.answers, glyph: "heart", short: "Ответы" },
  { section: VK_SECTION.messages, glyph: "message", short: "Диалоги" },
  { section: VK_SECTION.friends, glyph: "friends", short: "Друзья" },
  { section: VK_SECTION.groups, glyph: "groups", short: "Группы" },
  { section: VK_SECTION.photos, glyph: "photo", short: "Фото" },
  { section: VK_SECTION.video, glyph: "video", short: "Видео" },
  { section: VK_SECTION.audio, glyph: "audio", short: "Аудио" },
  { section: VK_SECTION.news, glyph: "bookmark", short: "Новости" },
  { section: VK_SECTION.search, glyph: "search", short: "Поиск" },
  { section: VK_SECTION.settings, glyph: "settings", short: "Настройки" },
];

/** Нижняя полоса держит четыре слота: три раздела и кнопку меню. */
export const VK_TABS: readonly VkNavEntry[] = [
  VK_DRAWER[0]!,
  VK_DRAWER[2]!,
  VK_DRAWER[3]!,
];
