"use client";

import { useRef, useState } from "react";
import { cn } from "@/core/utils/cn";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileDanger } from "@/components/apps/ie/pages/vk/mobile/VkMobileDanger";
import { VkMobileAccount } from "@/components/apps/ie/pages/vk/mobile/VkMobileAccount";

import { VkMobilePrivacy } from "@/components/apps/ie/pages/vk/mobile/VkMobilePrivacy";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { VkPrivacyPolicy } from "@/components/apps/ie/pages/vk/VkPrivacyPolicy";
import { uploadAvatar } from "@/core/vk/api/photos";
import {
  fetchProfile,
  updateProfile,
  type ProfilePatch,
} from "@/core/vk/api/profiles";
import { RELATIONSHIP_LABELS, type VkProfileRow } from "@/core/vk/vk-types";
import { useVkAccount } from "@/hooks/use-vk-account";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkMobileSettingsProps {
  me: VkProfileRow;
  onMenu: () => void;
}

const FIELDS: readonly { key: keyof ProfilePatch; label: string }[] = [
  { key: "first_name", label: "Имя" },
  { key: "last_name", label: "Фамилия" },
  { key: "city", label: "Город" },
  { key: "birthday", label: "День рождения" },
  { key: "activity", label: "Деятельность" },
  { key: "website", label: "Веб-сайт" },
];

const TABS = [
  "Страница",
  "Аккаунт",
  "Приватность",
  "Удаление",
  "О данных",
] as const;

export function VkMobileSettings({ me, onMenu }: VkMobileSettingsProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const account = useVkAccount(me);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Страница");
  const [draft, setDraft] = useState<ProfilePatch>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const value = (key: keyof ProfilePatch): string =>
    (draft[key] ?? me[key] ?? "") as string;

  const save = async () => {
    const message = await updateProfile(me.id, draft);
    if (message) {
      setError(message);
      return;
    }
    setProfile({ ...me, ...draft });
    setDraft({});
  };

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
    <VkMobileScreen
      title="Настройки"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      <nav className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[#d5d9de] bg-[#eceff1] px-[10px] py-2 text-[13px]">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              item === tab ? "font-bold text-[#45688e]" : "text-[#2a5885]",
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {account.notice && (
        <p
          className={cn(
            "px-[10px] py-2 text-[13px]",
            account.ok ? "text-[#2b7a3f]" : "text-[#b63131]",
          )}
        >
          {account.notice}
        </p>
      )}

      {tab === "Аккаунт" && <VkMobileAccount account={account} />}
      {tab === "Приватность" && <VkMobilePrivacy me={me} account={account} />}
      {tab === "Удаление" && <VkMobileDanger account={account} />}
      {tab === "О данных" && (
        <div className="px-[10px] py-3 text-[13px] leading-[18px]">
          <VkPrivacyPolicy />
        </div>
      )}

      {tab === "Страница" && (
        <>
          <div className="flex items-center gap-2.5 border-b border-[#d5d9de] bg-[linear-gradient(#fbfcfd,#f1f4f6)] px-[10px] py-2.5">
            <VkAvatar size={56} src={me.avatar_url} />
            <VkMobileButton
              tone="secondary"
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              {busy ? "Загрузка..." : "Сменить фотографию"}
            </VkMobileButton>
          </div>

          <form
            className="px-[10px] py-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            {FIELDS.map((field) => (
              <VkMobileField
                key={field.key}
                label={field.label}
                type={field.key === "birthday" ? "date" : "text"}
                value={value(field.key)}
                onChange={(next) => setDraft({ ...draft, [field.key]: next })}
              />
            ))}

            <label className="mb-2 block text-[12px] text-[#8a8a8a]">
              Семейное положение
              <select
                value={value("relationship_status") || "not_specified"}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    relationship_status: event.target.value,
                  })
                }
                className="mt-1 h-[29px] w-full rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] text-[#333]"
              >
                {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p className="mb-2 text-[12px] text-[#b63131]">{error}</p>
            )}

            <VkMobileButton type="submit" className="w-full">
              Сохранить
            </VkMobileButton>
          </form>
        </>
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
    </VkMobileScreen>
  );
}
