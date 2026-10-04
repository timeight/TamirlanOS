import type { VkGlyphName } from "@/core/vk/glyphs";
import { VK_SECTION, type VkSection } from "@/core/vk/sections";

export interface VkNavEntry {
  section: VkSection;
  glyph: VkGlyphName;
}

/** Порядок пунктов повторяет боковое меню приложения тех лет. */
export const VK_DRAWER: readonly VkNavEntry[] = [
  { section: VK_SECTION.profile, glyph: "user" },
  { section: VK_SECTION.answers, glyph: "heart" },
  { section: VK_SECTION.messages, glyph: "message" },
  { section: VK_SECTION.friends, glyph: "friends" },
  { section: VK_SECTION.groups, glyph: "groups" },
  { section: VK_SECTION.photos, glyph: "photo" },
  { section: VK_SECTION.video, glyph: "video" },
  { section: VK_SECTION.audio, glyph: "audio" },
  { section: VK_SECTION.news, glyph: "news" },
  { section: VK_SECTION.search, glyph: "search" },
  { section: VK_SECTION.settings, glyph: "settings" },
];
