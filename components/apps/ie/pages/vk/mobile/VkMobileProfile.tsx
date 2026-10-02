"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkFriendLink } from "@/components/apps/ie/pages/vk/VkFriendLink";
import { updateProfile, type ProfilePatch } from "@/core/vk/api/profiles";
import {
  RELATIONSHIP_LABELS,
  fullName,
  type VkProfileRow,
} from "@/core/vk/vk-types";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkMobileProfileProps {
  profile: VkProfileRow;
  isMe: boolean;
  viewerId: string;
  onWrite: (profileId: string) => void;
  onOpenProfile: (profileId: string) => void;
}

const FIELDS: readonly { key: keyof ProfilePatch; label: string }[] = [
  { key: "city", label: "Город" },
  { key: "birthday", label: "День рождения" },
  { key: "website", label: "Веб-сайт" },
  { key: "activity", label: "Деятельность" },
];

export function VkMobileProfile({
  profile,
  isMe,
  viewerId,
  onWrite,
  onOpenProfile,
}: VkMobileProfileProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfilePatch>({});

  const value = (key: keyof ProfilePatch): string =>
    (draft[key] ?? profile[key] ?? "") as string;

  const save = async () => {
    await updateProfile(profile.id, draft);
    setProfile({ ...profile, ...draft });
    setDraft({});
    setEditing(false);
  };

  return (
    <section className="px-3 py-3">
      <div className="flex gap-3">
        <VkAvatar size={72} src={profile.avatar_url} />
        <div className="min-w-0">
          <h1 className="text-[15px] leading-tight font-bold break-words text-[#2b587a]">
            {fullName(profile)}
          </h1>
          <p className="mt-0.5 text-[11px] break-all text-[#939393]">
            vk.com/{profile.username}
          </p>
          {isMe && (
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="mt-1.5 text-[12px] text-[#2b587a]"
            >
              {editing ? "Отменить" : "Редактировать"}
            </button>
          )}
        </div>
      </div>

      <VkFriendLink
        viewerId={viewerId}
        targetId={profile.id}
        onWrite={onWrite}
        onOpenProfile={onOpenProfile}
      />

      {editing ? (
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          {(["first_name", "last_name"] as const).map((key) => (
            <label key={key} className="mb-2 block text-[12px] text-[#777]">
              {key === "first_name" ? "Имя" : "Фамилия"}
              <input
                value={value(key)}
                onChange={(event) =>
                  setDraft({ ...draft, [key]: event.target.value })
                }
                className="mt-0.5 w-full border border-[#c0cad5] px-2 py-1.5 text-[13px] text-black outline-none focus:border-[#7196bd]"
              />
            </label>
          ))}

          {FIELDS.map((field) => (
            <label
              key={field.key}
              className="mb-2 block text-[12px] text-[#777]"
            >
              {field.label}
              <input
                type={field.key === "birthday" ? "date" : "text"}
                value={value(field.key)}
                onChange={(event) =>
                  setDraft({ ...draft, [field.key]: event.target.value })
                }
                className="mt-0.5 w-full border border-[#c0cad5] px-2 py-1.5 text-[13px] text-black outline-none focus:border-[#7196bd]"
              />
            </label>
          ))}

          <label className="mb-2 block text-[12px] text-[#777]">
            Семейное положение
            <select
              value={value("relationship_status") || "not_specified"}
              onChange={(event) =>
                setDraft({ ...draft, relationship_status: event.target.value })
              }
              className="mt-0.5 w-full border border-[#c0cad5] bg-white px-2 py-1.5 text-[13px] text-black"
            >
              {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full border border-[#b2bdc8] bg-[#edf1f5] py-2 text-[13px] text-[#2b587a]"
          >
            Сохранить
          </button>
        </form>
      ) : (
        <dl className="mt-3 text-[13px] leading-[20px]">
          {FIELDS.map((field) => {
            const text = profile[field.key] as string | null;
            if (!text) return null;
            return (
              <div key={field.key} className="flex gap-2 py-0.5">
                <dt className="shrink-0 text-[#777]">{field.label}:</dt>
                <dd className="min-w-0 break-words text-[#333]">{text}</dd>
              </div>
            );
          })}
          {profile.relationship_status && (
            <div className="flex gap-2 py-0.5">
              <dt className="shrink-0 text-[#777]">Сем. положение:</dt>
              <dd className="text-[#333]">
                {RELATIONSHIP_LABELS[profile.relationship_status]}
              </dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
}
