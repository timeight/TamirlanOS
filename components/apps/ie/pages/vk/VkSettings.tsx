"use client";

import { useRef, useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPrivacyPolicy } from "@/components/apps/ie/pages/vk/VkPrivacyPolicy";
import { VkSettingsAccount } from "@/components/apps/ie/pages/vk/VkSettingsAccount";
import { VkSettingsDanger } from "@/components/apps/ie/pages/vk/VkSettingsDanger";
import { VkSettingsPrivacy } from "@/components/apps/ie/pages/vk/VkSettingsPrivacy";
import { cn } from "@/core/utils/cn";
import { uploadAvatar } from "@/core/vk/api/photos";
import { fetchProfile } from "@/core/vk/api/profiles";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";
import { useVkAccount } from "@/hooks/use-vk-account";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkSettingsProps {
  me: VkProfileRow;
  onEditProfile: () => void;
}

const TABS = [
  "Страница",
  "Аккаунт",
  "Приватность",
  "Удаление",
  "О данных",
] as const;

export function VkSettings({ me, onEditProfile }: VkSettingsProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const account = useVkAccount(me);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Страница");
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

      <div className="mb-2 flex flex-wrap gap-3 text-[11px]">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              item === tab
                ? "font-bold text-[#45688e]"
                : "text-[#2b587a] hover:underline",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {account.notice && (
        <p
          className={cn(
            "mb-2 text-[11px]",
            account.ok ? "text-[#2b7a3f]" : "text-[#9b2c2c]",
          )}
        >
          {account.notice}
        </p>
      )}

      {tab === "Страница" && (
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
              <VkButton onClick={onEditProfile}>
                Редактировать страницу
              </VkButton>
            </div>
            {error && <p className="mt-2 text-[#9b2c2c]">{error}</p>}
            <p className="mt-4 text-[10px] leading-[15px] text-[#939393]">
              Адрес страницы задаётся при регистрации и не меняется.
            </p>
          </div>
        </div>
      )}

      {tab === "Аккаунт" && <VkSettingsAccount account={account} />}
      {tab === "Приватность" && <VkSettingsPrivacy me={me} account={account} />}
      {tab === "Удаление" && <VkSettingsDanger account={account} />}
      {tab === "О данных" && (
        <div className="pt-2 text-[11px] leading-[16px]">
          <VkPrivacyPolicy />
        </div>
      )}

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
