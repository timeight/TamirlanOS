"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useEffect, useRef, useState } from "react";
import { AgentComposer } from "./AgentComposer";
import { AgentMessage } from "./AgentMessage";
import { greetingReply, respond } from "@/core/agent/bot";
import { siteConfig } from "@/core/config/site";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useLocaleStore } from "@/stores/locale-store";

interface ChatMessage {
  id: number;
  from: "me" | "bot";
  body: string;
  time: string;
}

const LOCALE_TAG = { kk: "kk-KZ", ru: "ru-RU", en: "en-US" } as const;

export function AgentApp() {
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);
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
    // Seed once on mount; later replies pick up the current locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typing]);

  const push = (message: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...message, id: idRef.current++ }]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    push({ from: "me", body: text, time: now() });
    setInput("");
    const reply = respond(text);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ from: "bot", body: t(reply.key), time: now() });
      if (reply.action) openApp(reply.action);
    }, 650);
  };

  const lastBot = [...messages].reverse().find((m) => m.from === "bot");
  const status = lastBot
    ? t("agent.lastMsg", { time: lastBot.time })
    : t("agent.botName");

  return (
    <div className="flex h-full flex-col bg-white select-none">
      <div className="flex items-center gap-1 bg-[#dcecfb] px-1.5 pt-1">
        <span className="flex items-center gap-1.5 rounded-t-[4px] border border-b-0 border-[#a9cdec] bg-white px-3 py-1 text-[12px] font-bold text-[#2b6cb0]">
          <Image
            src="/assets/icons/agent.svg"
            alt=""
            width={14}
            height={14}
            unoptimized
          />
          {t("agent.botName")}
        </span>
      </div>

      <div className="flex items-center gap-3 border-y border-[#a9cdec] bg-gradient-to-b from-[#eaf4ff] to-[#cfe6fb] px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-[#1c4e80]">
            {t("agent.botName")}
          </p>
          <p className="truncate text-[11px] text-[#4a6b8a]">
            {t("agent.status")}
          </p>
        </div>
        <Image
          src={siteConfig.avatarSrc}
          alt=""
          width={44}
          height={44}
          unoptimized
          className="rounded-[4px] border border-white shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2 border-b border-[#cbe0f4] bg-[#f3f9ff] px-2 py-1 text-[11px]">
        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: idRef.current++,
                from: "bot",
                body: t(greetingReply().key),
                time: now(),
              },
            ])
          }
          className="rounded-[3px] border border-[#a9cdec] bg-white px-2 py-0.5 font-medium text-[#2b6cb0] hover:bg-[#e6f1fc]"
        >
          {t("agent.restart")}
        </button>
        <button
          type="button"
          onClick={() => {
            setTyping(true);
            window.setTimeout(() => {
              setTyping(false);
              push({ from: "bot", body: t("agent.msg.help"), time: now() });
            }, 400);
          }}
          className="rounded-[3px] border border-[#a9cdec] bg-white px-2 py-0.5 font-medium text-[#2b6cb0] hover:bg-[#e6f1fc]"
        >
          {t("agent.help")}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-auto bg-[#fbfdff] p-2"
      >
        {messages.map((message) => (
          <AgentMessage
            key={message.id}
            from={message.from}
            name={message.from === "bot" ? t("agent.botName") : t("agent.you")}
            body={message.body}
            time={message.time}
          />
        ))}
        {typing && (
          <p className="px-3 text-[11px] text-[#6b7785] italic">
            {t("agent.typing")}
          </p>
        )}
      </div>

      <AgentComposer
        value={input}
        placeholder={t("agent.placeholder")}
        sendLabel={t("agent.send")}
        statusLabel={status}
        textLabel={t("agent.text")}
        onChange={setInput}
        onSend={send}
      />
    </div>
  );
}
