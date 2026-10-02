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
    <div className="flex min-h-full flex-col" data-clarity-mask="true">
      <ul className="flex-1 bg-[#edeff1] px-2.5 py-2">
        {messages.length === 0 && (
          <li className="py-5 text-center text-[13px] text-[#95a0ab]">
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
                  "max-w-[80%] rounded-[4px] px-2.5 py-2 text-[14px] leading-[19px] break-words whitespace-pre-wrap",
                  mine
                    ? "bg-[#cfe0f3] text-[#2a2a2a]"
                    : "bg-white text-[#2a2a2a]",
                )}
              >
                {message.content}
                <span className="mt-1 block text-[11px] text-[#8a949e]">
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
        className="sticky bottom-0 flex items-end gap-2 border-t border-[#d8dde2] bg-white px-2.5 py-2"
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
          className="min-w-0 flex-1 resize-none rounded-[3px] border border-[#ccd4dd] px-2.5 py-2 text-[14px] outline-none focus:border-[#5181b8]"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Отправить сообщение"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[3px] bg-[#5181b8] text-white active:bg-[#4a76a8] disabled:opacity-50"
        >
          <VkGlyph name="send" size={18} />
        </button>
      </form>
    </div>
  );
}
