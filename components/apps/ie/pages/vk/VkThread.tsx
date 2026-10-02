"use client";

import { useEffect, useRef, useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { cn } from "@/core/utils/cn";
import type { VkMessageRow } from "@/core/vk/social-types";
import { vkDate } from "@/core/vk/vk-types";

interface VkThreadProps {
  messages: readonly VkMessageRow[];
  viewerId: string;
  title: string;
  onSend: (text: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  onBack: () => void;
}

/**
 * data-clarity-mask: Microsoft Clarity пишет сессии целиком, а это личная
 * переписка. Без атрибута чужие сообщения попали бы в записи просмотров.
 */
export function VkThread({
  messages,
  viewerId,
  title,
  onSend,
  onDelete,
  onBack,
}: VkThreadProps) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setDraft("");
    await onSend(text);
    setBusy(false);
  };

  return (
    <div data-clarity-mask="true">
      <div className="mb-2 flex items-center gap-2 border-b border-[#dae1e8] pb-1">
        <VkButton tone="quiet" onClick={onBack}>
          ← к диалогам
        </VkButton>
        <span className="truncate text-[11px] font-bold text-[#45688e]">
          {title}
        </span>
      </div>

      <ul className="max-h-[320px] overflow-y-auto">
        {messages.length === 0 && (
          <li className="py-4 text-[11px] text-[#939393]">
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
                  "max-w-[76%] border px-2 py-1.5 text-[11px] leading-[16px] break-words whitespace-pre-wrap",
                  mine
                    ? "border-[#c3d2e2] bg-[#e8eef5]"
                    : "border-[#e1e5e9] bg-[#f6f7f8]",
                )}
              >
                {message.content}
                <span className="mt-1 block text-[10px] text-[#939393]">
                  {vkDate(message.created_at)}
                  {mine && (
                    <button
                      type="button"
                      onClick={() => void onDelete(message.id)}
                      className="ml-2 text-[#2b587a] hover:underline"
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
        className="mt-2 flex gap-1.5 border-t border-[#dae1e8] pt-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          rows={2}
          placeholder="Введите сообщение"
          aria-label="Новое сообщение"
          className="min-w-0 flex-1 resize-none border border-[#c0cad5] px-1.5 py-1 text-[11px] outline-none focus:border-[#7196bd]"
        />
        <VkButton type="submit" disabled={busy}>
          Отправить
        </VkButton>
      </form>
    </div>
  );
}
