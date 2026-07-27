"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useEffect, useRef, useState } from "react";
import { AgentComposer } from "./AgentComposer";
import { AgentMessage } from "./AgentMessage";
import { AgentToolbar } from "./AgentToolbar";
import { greetingReply, respond } from "@/core/agent/bot";
import { siteConfig } from "@/core/config/site";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useLocaleStore } from "@/stores/locale-store";
import { useNotificationStore } from "@/stores/notification-store";

interface ChatMessage {
  id: number;
  from: "me" | "bot";
  body: string;
  time: string;
}

const LOCALE_TAG = { kk: "kk-KZ", ru: "ru-RU", en: "en-US" } as const;
const AGENT_ICON = "/assets/icons/agent.svg";
const EMAIL = "tamirlanzhamalov@gmail.com";

export function AgentApp() {
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);
  const notify = useNotificationStore((state) => state.notify);
  const openApp = useOpenApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = () =>
    new Date().toLocaleTimeString(LOCALE_TAG[locale], {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    setMessages([
      { id: 0, from: "bot", body: t(greetingReply().key), time: now() },
    ]);
    // Seeded once on mount; later replies follow the current locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typing]);

  const pushBot = (body: string) => {
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, from: "bot", body, time: now() },
    ]);
    notify({ iconSrc: AGENT_ICON, title: t("agent.botName"), body });
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: idRef.current++, from: "me", body: text, time: now() },
    ]);
    setInput("");
    const reply = respond(text);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushBot(t(reply.key));
      if (reply.action) openApp(reply.action);
    }, 700);
  };

  const restart = () => {
    setMessages([
      {
        id: idRef.current++,
        from: "bot",
        body: t(greetingReply().key),
        time: now(),
      },
    ]);
  };

  const lastBot = [...messages].reverse().find((m) => m.from === "bot");

  return (
    <div className="flex h-full flex-col bg-[#dcecfb] select-none">
      <div className="flex items-center gap-1 px-1.5 pt-1">
        <span className="flex items-center gap-1.5 rounded-t-[4px] border border-b-0 border-[#8fbde4] bg-white px-3 py-1 text-[12px] font-bold text-[#1c4e80]">
          <Image src={AGENT_ICON} alt="" width={14} height={14} unoptimized />
          {t("agent.botName")}
          <span aria-hidden="true" className="text-[#8aa8c4]">
            ✕
          </span>
        </span>
      </div>

      <AgentToolbar
        onRestart={restart}
        onHelp={() => pushBot(t("agent.msg.help"))}
        archiveLabel={t("agent.restart")}
        profileLabel={t("agent.profile")}
        menuLabel={t("agent.help")}
      />

      <div className="flex min-h-0 flex-1 gap-1.5 p-1.5">
        <div className="flex min-w-0 flex-1 flex-col rounded-[2px] border border-[#8fbde4] bg-white">
          <div className="truncate border-b border-[#dbe9f5] px-2 py-0.5 text-right text-[10px] text-[#5a7d9c]">
            {EMAIL}
          </div>
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-1 overflow-auto p-2"
          >
            {messages.map((message) => (
              <AgentMessage
                key={message.id}
                from={message.from}
                name={
                  message.from === "bot" ? t("agent.botName") : t("agent.you")
                }
                body={message.body}
                time={message.time}
              />
            ))}
            {typing && (
              <p className="text-[11px] text-[#6b7785] italic">
                {t("agent.typing")}
              </p>
            )}
          </div>
        </div>

        <div className="hidden w-[104px] shrink-0 flex-col items-center gap-1 rounded-[2px] border border-[#8fbde4] bg-white p-1.5 @[440px]:flex">
          <Image
            src={siteConfig.avatarSrc}
            alt=""
            width={88}
            height={88}
            unoptimized
            className="h-[88px] w-[88px] rounded-[2px] border border-[#a9cdec] object-cover"
          />
          <span className="text-[10px] text-[#2b6cb0] underline">
            {t("agent.enlarge")}
          </span>
          <div className="mt-auto flex gap-1 text-[12px]" aria-hidden="true">
            <span>🎨</span>
            <span>📷</span>
            <span>🎁</span>
          </div>
        </div>
      </div>

      <AgentComposer
        value={input}
        avatarSrc={siteConfig.avatarSrc}
        labels={{
          text: t("agent.text"),
          sms: t("agent.sms"),
          placeholder: t("agent.placeholder"),
          send: t("agent.send"),
          changePhoto: t("agent.changePhoto"),
        }}
        onChange={setInput}
        onSend={send}
      />

      <div className="flex shrink-0 items-center gap-2 border-t border-[#8fbde4] bg-gradient-to-b from-[#eaf5ff] to-[#cfe6fb] px-2 py-1.5">
        <span className="min-w-0 flex-1 truncate text-[11px] text-[#4a6b8a]">
          {lastBot
            ? t("agent.lastMsg", { time: lastBot.time })
            : t("agent.status")}
        </span>
        <button
          type="button"
          onClick={send}
          disabled={!input.trim()}
          className="rounded-[3px] border border-[#2b6cb0] bg-gradient-to-b from-[#7cc0f5] to-[#3f8ed6] px-5 py-1 text-[12px] font-bold text-white shadow-sm hover:brightness-105 disabled:cursor-default disabled:opacity-45 disabled:hover:brightness-100"
        >
          {t("agent.send")}
        </button>
      </div>
    </div>
  );
}
