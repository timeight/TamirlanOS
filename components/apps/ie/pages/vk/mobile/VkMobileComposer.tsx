"use client";

import { useRef } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import type { WallComposer } from "@/hooks/use-wall-composer";

interface VkMobileComposerProps {
  composer: WallComposer;
  own: boolean;
}

export function VkMobileComposer({ composer, own }: VkMobileComposerProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <form
      className="border-b border-[#d8dde2] px-3 py-2.5"
      onSubmit={(event) => {
        event.preventDefault();
        void composer.send();
      }}
    >
      <textarea
        value={composer.draft}
        onChange={(event) => composer.setDraft(event.target.value)}
        placeholder={own ? "Что у Вас нового?" : "Написать на стене"}
        rows={2}
        aria-label="Новая запись"
        className="w-full resize-none rounded-[3px] border border-[#ccd4dd] bg-white px-2.5 py-2 text-[14px] leading-[19px] outline-none focus:border-[#5181b8]"
      />

      {composer.attachedUrl && (
        <div className="mt-2 flex items-center gap-2">
          <span className="relative block h-[56px] w-[56px] overflow-hidden border border-[#d8dde2]">
            <AssetImage
              src={composer.attachedUrl}
              alt="Вложение"
              fill
              unoptimized
              className="object-cover"
            />
          </span>
          <button
            type="button"
            onClick={composer.detach}
            className="min-h-[44px] text-[13px] text-[#2a5885]"
          >
            убрать
          </button>
        </div>
      )}

      {composer.error && (
        <p className="mt-1.5 text-[13px] text-[#b63131]">{composer.error}</p>
      )}

      <div className="mt-2 flex items-center">
        <button
          type="button"
          disabled={composer.busy}
          onClick={() => input.current?.click()}
          aria-label="Прикрепить фотографию"
          className="flex h-[38px] w-[38px] items-center justify-center text-[#7a8d9f] disabled:opacity-50"
        >
          <VkGlyph name="photo" size={22} />
        </button>
        <VkMobileButton
          type="submit"
          size="small"
          disabled={composer.busy || !composer.canSend}
          className="ml-auto"
        >
          Отправить
        </VkMobileButton>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void composer.attach(file);
        }}
      />
    </form>
  );
}
