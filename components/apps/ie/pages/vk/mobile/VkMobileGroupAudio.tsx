"use client";

import { useRef, useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobileTrackList } from "@/components/apps/ie/pages/vk/mobile/VkMobileTrackList";
import { useVkAudio } from "@/hooks/use-vk-audio";

interface VkMobileGroupAudioProps {
  groupId: string;
  viewerId: string;
  canManage: boolean;
}

export function VkMobileGroupAudio({
  groupId,
  viewerId,
  canManage,
}: VkMobileGroupAudioProps) {
  const audio = useVkAudio(viewerId, groupId);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const input = useRef<HTMLInputElement>(null);

  if (!canManage && audio.tracks.length === 0) return null;

  return (
    <>
      <VkMobileGroupLabel>Аудиозаписи</VkMobileGroupLabel>

      {canManage && (
        <div className="border-b border-[#d5d9de] px-[10px] py-2">
          <VkMobileButton
            tone="secondary"
            className="w-full"
            disabled={audio.busy}
            onClick={() => input.current?.click()}
          >
            Загрузить аудиозапись
          </VkMobileButton>
        </div>
      )}

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
          onSubmit={async (event) => {
            event.preventDefault();
            await audio.add(file, { title, artist });
            setFile(null);
            setTitle("");
            setArtist("");
          }}
        >
          <VkMobileField
            label="Исполнитель"
            value={artist}
            onChange={setArtist}
          />
          <VkMobileField label="Название" value={title} onChange={setTitle} />
          <VkMobileButton
            type="submit"
            className="w-full"
            disabled={audio.busy}
          >
            Добавить
          </VkMobileButton>
        </form>
      )}

      {audio.error && (
        <p className="px-[10px] py-2 text-[13px] text-[#b63131]">
          {audio.error}
        </p>
      )}

      {audio.tracks.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Аудиозаписей нет.
        </p>
      ) : (
        <VkMobileTrackList
          tracks={audio.tracks}
          viewerId={viewerId}
          canModerate={canManage}
          onRemove={canManage ? (track) => void audio.remove(track) : undefined}
        />
      )}
    </>
  );
}
