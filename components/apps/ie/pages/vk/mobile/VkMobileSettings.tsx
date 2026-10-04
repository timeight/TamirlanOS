"use client";

import { useRef, useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { uploadAvatar } from "@/core/vk/api/photos";
import {
  fetchProfile,
  updateProfile,
  type ProfilePatch,
} from "@/core/vk/api/profiles";
import { RELATIONSHIP_LABELS, type VkProfileRow } from "@/core/vk/vk-types";
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

export function VkMobileSettings({ me, onMenu }: VkMobileSettingsProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
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
    const message = await uploadAvatar(me.id, file);
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
              setDraft({ ...draft, relationship_status: event.target.value })
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

        {error && <p className="mb-2 text-[12px] text-[#b63131]">{error}</p>}

        <VkMobileButton type="submit" className="w-full">
          Сохранить
        </VkMobileButton>
      </form>

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
