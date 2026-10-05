"use client";

import { useRef, useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { VkMobileTrackList } from "@/components/apps/ie/pages/vk/mobile/VkMobileTrackList";
import { useVkAudio } from "@/hooks/use-vk-audio";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileAudioProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
  onMenu: () => void;
}

export function VkMobileAudio({
  ownerId,
  viewerId,
  ownerName,
  onMenu,
}: VkMobileAudioProps) {
  const audio = useVkAudio(ownerId);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const mine = ownerId === viewerId;

  const send = async () => {
    if (!file) return;
    await audio.add(file, { title, artist });
    setFile(null);
    setTitle("");
    setArtist("");
  };

  return (
    <VkMobileScreen
      title={mine ? "Аудиозаписи" : ownerName}
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
      right={
        mine
          ? {
              glyph: "plus",
              label: "Загрузить аудиозапись",
              onClick: () => input.current?.click(),
            }
          : undefined
      }
    >
      <input
        ref={input}
        type="file"
        accept="audio/*,.mp3,.m4a"
        hidden
        onChange={(event) => {
          const picked = event.target.files?.[0] ?? null;
          event.target.value = "";
          setFile(picked);
          if (picked && !title) setTitle(picked.name.replace(/\.[^.]+$/, ""));
        }}
      />

      {file && (
        <form
          className="border-b border-[#d5d9de] px-[10px] py-2.5"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <p className="mb-1.5 text-[12px] text-[#8a8a8a]">Файл: {file.name}</p>
          <VkMobileField
            label="Исполнитель"
            value={artist}
            onChange={setArtist}
          />
          <VkMobileField label="Название" value={title} onChange={setTitle} />
          <div className="flex gap-1.5">
            <VkMobileButton
              type="submit"
              className="flex-1"
              disabled={audio.busy}
            >
              {audio.busy ? "Загрузка..." : "Добавить"}
            </VkMobileButton>
            <VkMobileButton tone="secondary" onClick={() => setFile(null)}>
              Отмена
            </VkMobileButton>
          </div>
        </form>
      )}

      {audio.error && (
        <p className="px-[10px] py-2 text-[13px] text-[#b63131]">
          {audio.error}
        </p>
      )}

      <form
        className="flex gap-2 border-b border-[#d5d9de] bg-[#eceff1] px-[10px] py-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void audio.search();
        }}
      >
        <input
          value={audio.query}
          onChange={(event) => audio.setQuery(event.target.value)}
          placeholder="Исполнитель или название"
          aria-label="Поиск аудиозаписей"
          className="h-[28px] min-w-0 flex-1 rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <VkMobileButton type="submit" disabled={audio.busy}>
          Найти
        </VkMobileButton>
      </form>

      {audio.found.length > 0 && (
        <>
          <VkMobileGroupLabel>Найдено</VkMobileGroupLabel>
          <VkMobileTrackList tracks={audio.found} viewerId={viewerId} />
        </>
      )}
      {audio.searched && audio.found.length === 0 && (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.notFound}
        </p>
      )}

      <VkMobileGroupLabel>
        {mine ? "Мои аудиозаписи" : "Аудиозаписи"}
      </VkMobileGroupLabel>

      {audio.loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : audio.tracks.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {mine ? "Вы ещё ничего не загрузили." : "Аудиозаписей нет."}
        </p>
      ) : (
        <VkMobileTrackList
          tracks={audio.tracks}
          viewerId={viewerId}
          onRemove={mine ? (track) => void audio.remove(track) : undefined}
        />
      )}
    </VkMobileScreen>
  );
}
