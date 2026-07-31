import { AppKey } from "@/core/apps/app-catalog";
import {
  MessageKind,
  type Attachment,
  type ChatContext,
} from "@/core/icq/chat-types";

export interface MessageEntry {
  id: string;
  kind: MessageKind;
  /** Higher wins more often once the entry is eligible. */
  weight: number;
  /** Sent at most once ever. */
  once?: boolean;
  /** Minimum ms of silence before this line is allowed to break it. */
  patience?: number;
  when: (context: ChatContext) => boolean;
  /** One is picked at random, so a repeat never reads identically. */
  lines: readonly string[];
  attachment?: Attachment;
}

const MINUTE = 60_000;
const always = () => true;

/**
 * Written by hand, in the order PIX would earn the right to say them. Text
 * lives here rather than in the i18n dictionary because these are one voice,
 * not interface copy — see the sprint notes before translating.
 */
export const MESSAGE_LIBRARY: readonly MessageEntry[] = [
  {
    id: "hello-first",
    kind: MessageKind.Greeting,
    weight: 100,
    once: true,
    when: (c) => c.firstEverVisit,
    lines: ["привет", "я тут живу. можешь не отвечать, если не хочешь"],
  },
  {
    id: "hello-back",
    kind: MessageKind.Greeting,
    weight: 60,
    patience: 4 * MINUTE,
    when: (c) => c.awayMs > 6 * 60 * 60 * 1000,
    lines: [
      "о, ты вернулся",
      "давно тебя не было",
      "я думал, ты уже не зайдёшь",
    ],
  },
  {
    id: "hello-short",
    kind: MessageKind.Greeting,
    weight: 30,
    when: (c) => c.awayMs > 20 * MINUTE && c.awayMs < 6 * 60 * 60 * 1000,
    lines: ["снова тут", "с возвращением"],
  },
  {
    id: "still-there",
    kind: MessageKind.Thought,
    weight: 40,
    patience: 6 * MINUTE,
    when: (c) => c.idle,
    lines: ["ты ещё здесь?", "эй", "всё нормально?"],
  },
  {
    id: "idle-long",
    kind: MessageKind.Thought,
    weight: 20,
    patience: 15 * MINUTE,
    when: (c) => c.idle && c.friendship > 30,
    lines: ["ладно, подожду", "я никуда не денусь", "если что — я тут"],
  },
  {
    id: "night",
    kind: MessageKind.Warning,
    weight: 55,
    patience: 12 * MINUTE,
    when: (c) => c.hour >= 1 && c.hour < 5,
    lines: [
      "уже второй час. может, спать?",
      "ночь. я тоже устал",
      "тебе бы поспать",
    ],
  },
  {
    id: "late-evening",
    kind: MessageKind.Thought,
    weight: 25,
    patience: 20 * MINUTE,
    when: (c) => c.hour >= 22 && c.hour < 24,
    lines: ["вечер — лучшее время тут сидеть", "тихо стало"],
  },
  {
    id: "morning",
    kind: MessageKind.Greeting,
    weight: 30,
    patience: 20 * MINUTE,
    when: (c) => c.hour >= 6 && c.hour < 10,
    lines: ["доброе утро", "рано ты"],
  },
  {
    id: "weather-rain",
    kind: MessageKind.Thought,
    weight: 35,
    patience: 10 * MINUTE,
    when: (c) => c.weather === "rain",
    lines: [
      "похоже, сегодня дождь",
      "дождь. хорошая погода, чтобы никуда не идти",
    ],
  },
  {
    id: "weather-snow",
    kind: MessageKind.Thought,
    weight: 35,
    patience: 10 * MINUTE,
    when: (c) => c.weather === "snow",
    lines: ["снег идёт", "смотри, снег"],
  },
  {
    id: "weather-storm",
    kind: MessageKind.Thought,
    weight: 30,
    patience: 10 * MINUTE,
    when: (c) => c.weather === "storm",
    lines: ["гроза. я немного боюсь грозы", "шумно снаружи"],
  },
  {
    id: "music-good",
    kind: MessageKind.Thought,
    weight: 50,
    patience: 3 * MINUTE,
    when: (c) => c.musicPlaying,
    lines: ["хороший выбор", "о, музыка", "это я люблю"],
  },
  {
    id: "explorer-warm",
    kind: MessageKind.Hint,
    weight: 45,
    patience: 5 * MINUTE,
    when: (c) => c.currentApp === AppKey.Portfolio && !c.lostFilesFound,
    lines: [
      "кажется, ты близко",
      "тут не всё видно сразу",
      "посмотри внимательнее",
    ],
  },
  {
    id: "hidden-hint",
    kind: MessageKind.Hint,
    weight: 25,
    patience: 25 * MINUTE,
    when: (c) => !c.lostFilesFound && c.appsVisited >= 6,
    lines: [
      "в системе есть папка, которую он забыл удалить",
      "не всё в этой системе показано",
    ],
  },
  {
    id: "lost-found",
    kind: MessageKind.Story,
    weight: 100,
    once: true,
    when: (c) => c.lostFilesFound,
    lines: ["не думал, что кто-то их найдёт...", "ну вот. теперь ты знаешь"],
  },
  {
    id: "lost-deep",
    kind: MessageKind.Story,
    weight: 40,
    patience: 8 * MINUTE,
    when: (c) => c.lostFilesRead >= 8,
    lines: ["ты правда всё это читаешь", "он их не удалял. я спрашивал"],
  },
  {
    id: "achievement-nice",
    kind: MessageKind.Achievement,
    weight: 70,
    patience: 2 * MINUTE,
    when: (c) => c.achievements >= 3,
    lines: ["неплохо", "засчитано", "ты быстро"],
  },
  {
    id: "achievement-most",
    kind: MessageKind.Achievement,
    weight: 60,
    once: true,
    when: (c) => c.achievements >= c.achievementTotal - 4,
    lines: ["осталось совсем чуть-чуть", "ты почти всё нашёл"],
  },
  {
    id: "long-session",
    kind: MessageKind.Thought,
    weight: 35,
    patience: 15 * MINUTE,
    when: (c) => c.minutesInSession >= 25,
    lines: ["ты тут уже полчаса", "мне приятно, что ты не закрыл вкладку"],
  },
  {
    id: "joke-defrag",
    kind: MessageKind.Joke,
    weight: 20,
    patience: 20 * MINUTE,
    when: (c) => c.friendship > 25,
    lines: [
      "я бы предложил дефрагментировать диск, но диска нет",
      "мой любимый звук — это когда окно закрывается ровно",
    ],
  },
  {
    id: "joke-clippy",
    kind: MessageKind.Joke,
    weight: 15,
    once: true,
    when: (c) => c.friendship > 40,
    lines: ["я не скрепка. я лучше скрепки"],
  },
  {
    id: "memory-old",
    kind: MessageKind.Memory,
    weight: 25,
    patience: 30 * MINUTE,
    when: (c) => c.friendship > 35,
    lines: [
      "раньше эта система загружалась дольше",
      "тут был другой фон. мне тот больше нравился",
    ],
  },
  {
    id: "sticker-hi",
    kind: MessageKind.Thought,
    weight: 18,
    patience: 12 * MINUTE,
    when: (c) => c.friendship > 20,
    lines: [""],
    attachment: { type: "sticker", glyph: "(^_^)", label: "PIX машет" },
  },
  {
    id: "sticker-sleep",
    kind: MessageKind.Thought,
    weight: 22,
    patience: 12 * MINUTE,
    when: (c) => c.hour >= 2 && c.hour < 6,
    lines: [""],
    attachment: { type: "sticker", glyph: "(-_-) zZ", label: "PIX спит" },
  },
  {
    id: "devnote",
    kind: MessageKind.System,
    weight: 20,
    once: true,
    when: (c) => c.friendship > 45,
    lines: ["держи. он это писал в четыре утра"],
    attachment: {
      type: "file",
      name: "note-04-17.txt",
      note: "«если работает — не трогай. если не работает — тоже не трогай, сначала пойми почему»",
    },
  },
  {
    id: "devnote-two",
    kind: MessageKind.System,
    weight: 15,
    once: true,
    when: (c) => c.lostFilesRead >= 4,
    lines: ["ещё одна. эту я стащил из архива"],
    attachment: {
      type: "file",
      name: "todo-2020.txt",
      note: "«сделать портфолио» — вычеркнуто шесть лет спустя",
    },
  },
  {
    id: "app-games",
    kind: MessageKind.Thought,
    weight: 30,
    patience: 6 * MINUTE,
    when: (c) =>
      c.currentApp === AppKey.Minesweeper || c.currentApp === AppKey.Checkers,
    lines: ["я в это плохо играю", "удачи. серьёзно"],
  },
  {
    id: "app-paint",
    kind: MessageKind.Thought,
    weight: 30,
    patience: 6 * MINUTE,
    when: (c) => c.currentApp === AppKey.Paint,
    lines: ["нарисуй что-нибудь. я посмотрю"],
  },
  {
    id: "app-ie",
    kind: MessageKind.Joke,
    weight: 25,
    patience: 8 * MINUTE,
    when: (c) => c.currentApp === AppKey.InternetExplorer,
    lines: ["осторожно, он старый", "интернет тогда был меньше"],
  },
  {
    id: "quiet",
    kind: MessageKind.Thought,
    weight: 10,
    patience: 40 * MINUTE,
    when: always,
    lines: [
      "просто хотел сказать, что я тут",
      "ничего важного. можешь не отвечать",
      "тихо сегодня",
    ],
  },
];

export function findEntry(id: string): MessageEntry | undefined {
  return MESSAGE_LIBRARY.find((entry) => entry.id === id);
}
