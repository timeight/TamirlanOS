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

/** Одна строка: поле, скрепка и кнопка — большой формы здесь никогда не было. */
export function VkMobileComposer({ composer, own }: VkMobileComposerProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <form
      className="border-b border-[#d5d9de] px-[10px] py-[7px]"
      onSubmit={(event) => {
        event.preventDefault();
        void composer.send();
      }}
    >
      <div className="flex items-center gap-2">
        <textarea
          value={composer.draft}
          onChange={(event) => composer.setDraft(event.target.value)}
          placeholder={own ? "Что у Вас нового?" : "Написать на стене"}
          rows={1}
          aria-label="Новая запись"
          className="min-h-[29px] min-w-0 flex-1 resize-none rounded-[3px] border border-[#c2cad3] bg-white px-[7px] py-[5px] text-[13px] leading-[17px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <button
          type="button"
          disabled={composer.busy}
          onClick={() => input.current?.click()}
          aria-label="Прикрепить фотографию"
          className="flex h-[29px] w-[24px] shrink-0 items-center justify-center text-[#7a8d9f] disabled:opacity-50"
        >
          <VkGlyph name="photo" size={20} />
        </button>
        <VkMobileButton
          type="submit"
          disabled={composer.busy || !composer.canSend}
          className="shrink-0"
        >
          OK
        </VkMobileButton>
      </div>

      {composer.attachedUrl && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="relative block h-[48px] w-[48px] overflow-hidden border border-[#cfd6dc]">
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
            className="text-[12px] text-[#2a5885]"
          >
            убрать
          </button>
        </div>
      )}

      {composer.error && (
        <p className="mt-1 text-[12px] text-[#b63131]">{composer.error}</p>
      )}

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
