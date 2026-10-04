/** Названия разделов — ровно те, что стояли в левом меню в 2012 году. */
export const VK_SECTION = {
  profile: "Моя страница",
  friends: "Мои друзья",
  photos: "Мои фотографии",
  video: "Мои видеозаписи",
  audio: "Мои аудиозаписи",
  messages: "Мои сообщения",
  groups: "Мои группы",
  news: "Мои новости",
  answers: "Мои ответы",
  settings: "Мои настройки",
  search: "Поиск людей",
} as const;

export type VkSection = (typeof VK_SECTION)[keyof typeof VK_SECTION];

/** Порядок меню; «Поиск людей» дописывается отдельно — его в 2012 не было. */
export const VK_NAV: readonly VkSection[] = [
  VK_SECTION.profile,
  VK_SECTION.friends,
  VK_SECTION.photos,
  VK_SECTION.video,
  VK_SECTION.audio,
  VK_SECTION.messages,
  VK_SECTION.groups,
  VK_SECTION.news,
  VK_SECTION.answers,
  VK_SECTION.settings,
];

/** Разделы, за которыми стоит реальная таблица в базе. */
export const VK_IMPLEMENTED: readonly VkSection[] = [
  VK_SECTION.profile,
  VK_SECTION.news,
  VK_SECTION.friends,
  VK_SECTION.photos,
  VK_SECTION.messages,
  VK_SECTION.groups,
  VK_SECTION.answers,
  VK_SECTION.settings,
  VK_SECTION.search,
];

export function isImplemented(section: string): boolean {
  return (VK_IMPLEMENTED as readonly string[]).includes(section);
}

/** На чужой странице подпись «Мои друзья» звучала бы странно. */
export function sectionTitle(section: string, mine: boolean): string {
  if (mine) return section;
  return section.replace(/^Мои /, "").replace(/^Моя /, "");
}
