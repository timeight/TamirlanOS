"use client";

import { useRef, useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { uploadAvatar } from "@/core/vk/api/photos";
import { fetchProfile, signOut } from "@/core/vk/api/profiles";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkSettingsProps {
  me: VkProfileRow;
  onEditProfile: () => void;
}

export function VkSettings({ me, onEditProfile }: VkSettingsProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    const message = await uploadAvatar(me.id, file, me.avatar_url);
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    const fresh = await fetchProfile(me.id);
    if (fresh) setProfile(fresh);
  };

  return (
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Мои настройки
      </h1>

      <div className="flex items-start gap-4">
        <div className="border border-[#dae1e8] p-1">
          <VkAvatar size={120} src={me.avatar_url} />
        </div>

        <div className="min-w-0 flex-1 text-[11px]">
          <p className="font-bold text-[#2b587a]">{fullName(me)}</p>
          <p className="mt-0.5 text-[#777]">vk.com/{me.username}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <VkButton disabled={busy} onClick={() => input.current?.click()}>
              {busy ? "Загрузка..." : "Сменить фотографию"}
            </VkButton>
            <VkButton onClick={onEditProfile}>Редактировать страницу</VkButton>
            <VkButton tone="quiet" onClick={() => void signOut()}>
              Выйти из аккаунта
            </VkButton>
          </div>

          {error && <p className="mt-2 text-[#9b2c2c]">{error}</p>}

          <p className="mt-4 text-[10px] leading-[15px] text-[#939393]">
            Адрес страницы задаётся при регистрации и не меняется. Пароль и
            почту меняйте через письмо восстановления — приложение их не хранит.
          </p>
        </div>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
