/** Russian needs three forms; a bare "N комментариев" reads wrong at 1 and 2. */
export function pluralComments(count: number): string {
  const tail = count % 100;
  if (tail >= 11 && tail <= 14) return `${count} комментариев`;
  const last = count % 10;
  if (last === 1) return `${count} комментарий`;
  if (last >= 2 && last <= 4) return `${count} комментария`;
  return `${count} комментариев`;
}

export interface VkComment {
  id: string;
  author: string;
  text: string;
  at: string;
}

export interface VkPost {
  id: string;
  author: string;
  at: string;
  text: string;
  likes: number;
  liked: boolean;
  comments: VkComment[];
}

export interface VkProfile {
  name: string;
  status: string;
  city: string;
  birthday: string;
  site: string;
  activity: string;
  friends: number;
  photos: number;
  groups: number;
  audios: number;
}

/** Everything the page shows about its owner. Swap this to change the profile. */
export const VK_PROFILE: VkProfile = {
  name: "Тамирлан Жамалов",
  status: "winamp не умер, он просто свернулся",
  city: "Казахстан",
  birthday: "9 ноября",
  site: "tamirlan.kz",
  activity: "школа, Blender, фотоаппарат",
  friends: 243,
  photos: 87,
  groups: 36,
  audios: 412,
};

export const VK_NAV: readonly string[] = [
  "Моя страница",
  "Мои друзья",
  "Мои фотографии",
  "Мои видеозаписи",
  "Мои аудиозаписи",
  "Мои сообщения",
  "Мои группы",
  "Мои новости",
  "Мои ответы",
  "Мои настройки",
];

export const VK_FRIENDS: readonly string[] = [
  "Алия",
  "Даниил",
  "Марат",
  "Камила",
  "Ержан",
  "Настя",
];

const comment = (
  id: string,
  author: string,
  text: string,
  at: string,
): VkComment => ({ id, author, text, at });

/** Seeded once into the store; after that the visitor's copy is the truth. */
export const VK_SEED_POSTS: readonly VkPost[] = [
  {
    id: "post-1",
    author: VK_PROFILE.name,
    at: "сегодня в 14:32",
    text: "Поставил вторую винду на старый комп. Теперь он грузится две минуты вместо одной.",
    likes: 24,
    liked: false,
    comments: [
      comment("c-1", "Марат", "а зачем вторая :D", "сегодня в 14:40"),
      comment(
        "c-2",
        "Алия",
        "у меня так же было, потом вообще не включился",
        "сегодня в 15:02",
      ),
    ],
  },
  {
    id: "post-2",
    author: VK_PROFILE.name,
    at: "вчера в 23:51",
    text: "Рендер шёл всю ночь. Утром открыл — куб. Красивый, но куб.",
    likes: 61,
    liked: false,
    comments: [
      comment("c-3", "Даниил", "зато свет поставил", "вчера в 23:58"),
      comment("c-4", "Камила", "классный куб :)", "сегодня в 00:14"),
      comment("c-5", "Ержан", "сколько считался?", "сегодня в 09:20"),
    ],
  },
  {
    id: "post-3",
    author: VK_PROFILE.name,
    at: "12 мар в 18:07",
    text: "Кто-нибудь знает, где взять нормальные скины для Winamp? Старые ссылки не работают.",
    likes: 12,
    liked: false,
    comments: [comment("c-6", "Настя", "поищи на форуме", "12 мар в 18:30")],
  },
  {
    id: "post-4",
    author: VK_PROFILE.name,
    at: "3 мар в 21:15",
    text: "Сегодня первый раз снял на плёнку. Половина кадров засвечена. Две получились.",
    likes: 38,
    liked: false,
    comments: [],
  },
  {
    id: "post-5",
    author: VK_PROFILE.name,
    at: "26 фев в 16:44",
    text: "Сделал сайт на таблицах. Работает только у меня на мониторе. Пойдёт.",
    likes: 19,
    liked: false,
    comments: [
      comment("c-7", "Марат", "скинь ссылку", "26 фев в 17:02"),
      comment("c-8", "Алия", "а у меня всё поехало", "26 фев в 19:11"),
    ],
  },
];
