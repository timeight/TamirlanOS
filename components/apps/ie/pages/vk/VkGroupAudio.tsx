"use client";

import { useRef, useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import { VkTrackList } from "@/components/apps/ie/pages/vk/VkTrackList";
import { useVkAudio } from "@/hooks/use-vk-audio";

interface VkGroupAudioProps {
  groupId: string;
  viewerId: string;
  /** Загружать и убирать записи сообщества могут только владелец и админ. */
  canManage: boolean;
}

export function VkGroupAudio({
  groupId,
  viewerId,
  canManage,
}: VkGroupAudioProps) {
  const audio = useVkAudio(viewerId, groupId);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const input = useRef<HTMLInputElement>(null);

  if (!canManage && audio.tracks.length === 0) return null;

  return (
    <div className="mt-5">
      <h2 className="flex items-center gap-3 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Аудиозаписи
        {canManage && (
          <VkButton
            tone="quiet"
            className="ml-auto"
            disabled={audio.busy}
            onClick={() => input.current?.click()}
          >
            Загрузить
          </VkButton>
        )}
      </h2>

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
          className="border-b border-[#dae1e8] py-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await audio.add(file, { title, artist });
            setFile(null);
            setTitle("");
            setArtist("");
          }}
        >
          <VkField label="Исполнитель:" value={artist} onChange={setArtist} />
          <VkField label="Название:" value={title} onChange={setTitle} />
          <VkButton type="submit" disabled={audio.busy} className="ml-[120px]">
            Добавить
          </VkButton>
        </form>
      )}

      {audio.error && (
        <p className="py-1 text-[11px] text-[#9b2c2c]">{audio.error}</p>
      )}

      {audio.tracks.length === 0 ? (
        <p className="py-3 text-[11px] text-[#939393]">Аудиозаписей нет.</p>
      ) : (
        <VkTrackList
          tracks={audio.tracks}
          viewerId={viewerId}
          canModerate={canManage}
          onRemove={canManage ? (track) => void audio.remove(track) : undefined}
        />
      )}
    </div>
  );
}
