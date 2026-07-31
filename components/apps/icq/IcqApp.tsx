"use client";

import { useEffect, useRef, useState } from "react";
import { IcqHeader } from "@/components/apps/icq/IcqHeader";
import { IcqMessageRow } from "@/components/apps/icq/IcqMessageRow";
import { useIcqStore } from "@/stores/icq-store";

const QUICK_REPLIES = ["привет", "как ты?", "ага", "покажи ещё"];

export function IcqApp() {
  const messages = useIcqStore((state) => state.messages);
  const status = useIcqStore((state) => state.status);
  const markSeen = useIcqStore((state) => state.markSeen);
  const reply = useIcqStore((state) => state.reply);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markSeen();
  }, [markSeen, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    reply(clean);
    setDraft("");
  };

  return (
    <div className="@container flex h-full min-h-0 flex-col bg-[#f2f6fb]">
      <IcqHeader status={status} />

      <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
        {messages.length === 0 && (
          <p className="mt-6 text-center text-[11px] text-[#7d8794]">
            Пока тихо. PIX пишет сам, когда есть что сказать.
          </p>
        )}
        <ol className="space-y-2">
          {messages.map((message) => (
            <IcqMessageRow key={message.id} message={message} />
          ))}
        </ol>
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-[#b9cbe0] bg-[#e6eef7] p-2">
        <div className="mb-1.5 flex flex-wrap gap-1">
          {QUICK_REPLIES.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => send(text)}
              className="rounded-sm border border-[#a8bed6] bg-white px-2 py-0.5 text-[11px] text-[#2c4a6b] hover:bg-[#dce9f6] focus-visible:outline-1 focus-visible:outline-[#316ac5]"
            >
              {text}
            </button>
          ))}
        </div>
        <form
          className="flex gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Сообщение"
            placeholder="Напишите что-нибудь…"
            className="min-w-0 flex-1 rounded-sm border border-[var(--os-field-border)] bg-white px-2 py-1 text-[12px] outline-none focus-visible:outline-1 focus-visible:outline-[#316ac5]"
          />
          <button
            type="submit"
            className="rounded-sm border border-[#a8bed6] bg-[#dce9f6] px-3 py-1 text-[11px] font-bold text-[#2c4a6b] hover:bg-[#cfe0f2] active:translate-y-px"
          >
            OK
          </button>
        </form>
      </div>
    </div>
  );
}
