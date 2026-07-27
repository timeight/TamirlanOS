import { AppKey } from "@/core/apps/app-catalog";
import type { AppId } from "@/types/application";

export interface BotReply {
  key: string;
  action?: AppId;
}

interface Intent {
  keywords: readonly string[];
  key: string;
  action?: AppId;
}

// Ordered by priority: the first intent whose keyword appears in the input wins.
const INTENTS: readonly Intent[] = [
  {
    keywords: ["project", "проект", "жоба", "портфол", "работ", "кейс"],
    key: "agent.msg.projects",
    action: AppKey.Projects,
  },
  {
    keywords: ["resume", "cv", "резюме", "түйіндеме"],
    key: "agent.msg.resume",
    action: AppKey.Resume,
  },
  {
    keywords: [
      "contact",
      "контакт",
      "связ",
      "почт",
      "email",
      "mail",
      "байланыс",
      "написать",
    ],
    key: "agent.msg.contact",
    action: AppKey.Contact,
  },
  {
    keywords: ["skill", "навык", "стек", "технолог", "умеешь", "дағды"],
    key: "agent.msg.skills",
    action: AppKey.Skills,
  },
  {
    keywords: [
      "about",
      "обо мне",
      "о себе",
      "кто ты",
      "расскажи",
      "мен туралы",
      "кім",
    ],
    key: "agent.msg.about",
    action: AppKey.AboutMe,
  },
  {
    keywords: ["help", "команд", "помощ", "что ты", "көмек", "менюсі"],
    key: "agent.msg.help",
  },
  {
    keywords: ["привет", "здравств", "hello", "hi ", "салам", "сәлем", "хай"],
    key: "agent.msg.hello",
  },
  {
    keywords: ["спасиб", "благодар", "thank", "рахмет", "рақмет"],
    key: "agent.msg.thanks",
  },
];

export function greetingReply(): BotReply {
  return { key: "agent.msg.greeting" };
}

export function respond(input: string): BotReply {
  const text = ` ${input.toLowerCase().trim()} `;
  for (const intent of INTENTS) {
    if (intent.keywords.some((word) => text.includes(word))) {
      return { key: intent.key, action: intent.action };
    }
  }
  return { key: "agent.msg.fallback" };
}
