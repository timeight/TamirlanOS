"use client";

import { useRef, useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import { VkPlayerBar } from "@/components/apps/ie/pages/vk/VkPlayerBar";
import { VkTrackList } from "@/components/apps/ie/pages/vk/VkTrackList";
import { useVkAudio } from "@/hooks/use-vk-audio";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkAudioProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
}

export function VkAudio({ ownerId, viewerId, ownerName }: VkAudioProps) {
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
    <div className="pt-3">
      <h1 className="mb-2 flex items-center gap-3 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        {mine ? "Мои аудиозаписи" : `Аудиозаписи · ${ownerName}`}
        {mine && (
          <VkButton
            tone="quiet"
            className="ml-auto"
            disabled={audio.busy}
            onClick={() => input.current?.click()}
          >
            Загрузить
          </VkButton>
        )}
      </h1>

      <input
        ref={input}
        type="file"
        accept="audio/*,.mp3,.m4a"
        hidden
        onChange={(event) => {
          const picked = event.target.files?.[0] ?? null;
          event.target.value = "";
          setFile(picked);
          // Имя файла — разумная заготовка, когда тегов нет.
          if (picked && !title) setTitle(picked.name.replace(/\.[^.]+$/, ""));
        }}
      />

      {file && (
        <form
          className="mb-3 border-b border-[#dae1e8] pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <p className="mb-1 text-[11px] text-[#777]">Файл: {file.name}</p>
          <VkField label="Исполнитель:" value={artist} onChange={setArtist} />
          <VkField label="Название:" value={title} onChange={setTitle} />
          <span className="ml-[120px] inline-flex gap-2">
            <VkButton type="submit" disabled={audio.busy}>
              {audio.busy ? "Загрузка..." : "Добавить"}
            </VkButton>
            <VkButton tone="quiet" onClick={() => setFile(null)}>
              Отменить
            </VkButton>
          </span>
        </form>
      )}

      {audio.error && (
        <p className="mb-2 text-[11px] text-[#9b2c2c]">{audio.error}</p>
      )}

      {audio.loading ? (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      ) : audio.tracks.length === 0 ? (
        <p className="py-4 text-[11px] text-[#939393]">
          {mine ? "Вы ещё ничего не загрузили." : "Аудиозаписей нет."}
        </p>
      ) : (
        <VkTrackList
          tracks={audio.tracks}
          viewerId={viewerId}
          onRemove={mine ? (track) => void audio.remove(track) : undefined}
        />
      )}

      <VkPlayerBar />

      <h2 className="mt-4 mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Поиск аудиозаписей
      </h2>
      <form
        className="flex gap-1.5"
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
          className="w-full max-w-[260px] min-w-0 border border-[#c0cad5] bg-white px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
        />
        <VkButton type="submit" disabled={audio.busy}>
          Найти
        </VkButton>
      </form>

      {audio.searched && audio.found.length === 0 && (
        <p className="mt-3 text-[11px] text-[#939393]">Ничего не найдено.</p>
      )}
      {audio.found.length > 0 && (
        <div className="mt-2">
          <VkTrackList tracks={audio.found} viewerId={viewerId} />
        </div>
      )}
    </div>
  );
}
