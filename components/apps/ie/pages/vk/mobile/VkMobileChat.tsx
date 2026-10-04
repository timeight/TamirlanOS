"use client";

import { useEffect, useRef, useState } from "react";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { cn } from "@/core/utils/cn";
import { vkDate } from "@/core/vk/vk-types";
import type { VkMessenger } from "@/hooks/use-vk-messages";

interface VkMobileChatProps {
  messenger: VkMessenger;
  viewerId: string;
}

/** data-clarity-mask: личная переписка не должна попадать в записи сессий. */
export function VkMobileChat({ messenger, viewerId }: VkMobileChatProps) {
  const { messages, send, remove } = messenger;
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const submit = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setDraft("");
    await send(text);
    setBusy(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-clarity-mask="true">
      <ul className="flex-1 bg-[#e9ebee] px-2 py-1.5">
        {messages.length === 0 && (
          <li className="py-5 text-center text-[13px] text-[#9aa4ad]">
            Сообщений пока нет.
          </li>
        )}
        {messages.map((message) => {
          const mine = message.author_id === viewerId;
          return (
            <li
              key={message.id}
              className={cn(
                "flex py-1",
                mine ? "justify-end" : "justify-start",
              )}
            >
              <span
                className={cn(
                  "max-w-[80%] rounded-[3px] border px-2 py-1.5 text-[13px] leading-[18px] break-words whitespace-pre-wrap",
                  mine
                    ? "border-[#bcd2ea] bg-[#d2e3f7] text-[#333]"
                    : "border-[#d5d9de] bg-white text-[#333]",
                )}
              >
                {message.content}
                <span className="mt-0.5 block text-[11px] text-[#9aa4ad]">
                  {vkDate(message.created_at)}
                  {mine && (
                    <button
                      type="button"
                      onClick={() => void remove(message.id)}
                      className="ml-2 text-[#2a5885]"
                    >
                      удалить
                    </button>
                  )}
                </span>
              </span>
            </li>
          );
        })}
        <div ref={bottom} />
      </ul>

      <form
        className="sticky bottom-0 flex items-center gap-2 border-t border-[#d5d9de] bg-[linear-gradient(#fbfcfd,#eff2f5)] px-2 py-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          rows={1}
          placeholder="Сообщение..."
          aria-label="Новое сообщение"
          className="min-h-[29px] min-w-0 flex-1 resize-none rounded-[3px] border border-[#c2cad3] bg-white px-[7px] py-1.5 text-[13px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Отправить сообщение"
          className="flex h-[29px] w-[32px] shrink-0 items-center justify-center rounded-[3px] border border-[#41699b] bg-[linear-gradient(#6a93c3,#5181b8)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] active:bg-[#4a76a8] disabled:opacity-50"
        >
          <VkGlyph name="send" size={15} />
        </button>
      </form>
    </div>
  );
}
