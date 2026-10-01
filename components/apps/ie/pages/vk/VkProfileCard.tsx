"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import { updateProfile, type ProfilePatch } from "@/core/vk/api/profiles";
import {
  RELATIONSHIP_LABELS,
  fullName,
  type VkProfileRow,
} from "@/core/vk/vk-types";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkProfileCardProps {
  profile: VkProfileRow;
  isMe: boolean;
}

export function VkProfileCard({ profile, isMe }: VkProfileCardProps) {
  const setProfile = useVkSessionStore((state) => state.setProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfilePatch>({});
  const [error, setError] = useState<string | null>(null);

  const value = <K extends keyof ProfilePatch>(key: K): string =>
    (draft[key] ?? profile[key] ?? "") as string;

  const save = async () => {
    const message = await updateProfile(profile.id, draft);
    if (message) {
      setError(message);
      return;
    }
    setProfile({ ...profile, ...draft });
    setDraft({});
    setEditing(false);
  };

  return (
    <div className="flex gap-4 pt-3">
      <div className="w-[200px] shrink-0">
        <div className="border border-[#dae1e8] p-1">
          <VkAvatar size={190} src={profile.avatar_url} />
        </div>
        {isMe && (
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="mt-2 text-[11px] text-[#2b587a] hover:underline"
          >
            {editing ? "Отменить" : "Редактировать страницу"}
          </button>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] leading-tight font-bold text-[#2b587a]">
          {fullName(profile)}
        </h1>
        <p className="mt-0.5 text-[11px] text-[#777]">
          vk.com/{profile.username}
        </p>

        <p className="mt-3 mb-1 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
          Информация
        </p>

        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <VkField
              label="Имя:"
              value={value("first_name")}
              onChange={(v) => setDraft({ ...draft, first_name: v })}
            />
            <VkField
              label="Фамилия:"
              value={value("last_name")}
              onChange={(v) => setDraft({ ...draft, last_name: v })}
            />
            <VkField
              label="Город:"
              value={value("city")}
              onChange={(v) => setDraft({ ...draft, city: v })}
            />
            <VkField
              label="День рождения:"
              type="date"
              value={value("birthday")}
              onChange={(v) => setDraft({ ...draft, birthday: v })}
            />
            <VkField
              label="Веб-сайт:"
              value={value("website")}
              onChange={(v) => setDraft({ ...draft, website: v })}
            />
            <VkField
              label="Деятельность:"
              value={value("activity")}
              onChange={(v) => setDraft({ ...draft, activity: v })}
            />
            <label className="mb-1.5 flex items-start gap-3 text-[11px]">
              <span className="w-[108px] shrink-0 pt-[3px] text-right text-[#777]">
                Семейное положение:
              </span>
              <select
                value={value("relationship_status") || "not_specified"}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    relationship_status: event.target.value,
                  })
                }
                className="border border-[#c0cad5] bg-white px-1 py-[2px] text-[11px]"
              >
                {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p className="ml-[120px] text-[11px] text-[#9b2c2c]">{error}</p>
            )}
            <button
              type="submit"
              className="mt-2 ml-[120px] border border-[#b2bdc8] bg-[#edf1f5] px-4 py-1 text-[11px] text-[#2b587a] hover:bg-[#e2e8ee]"
            >
              Сохранить
            </button>
          </form>
        ) : (
          <table className="text-[11px] leading-[18px]">
            <tbody>
              <InfoRow label="Город:" value={profile.city} />
              <InfoRow label="День рождения:" value={profile.birthday} />
              <InfoRow label="Веб-сайт:" value={profile.website} />
              <InfoRow label="Деятельность:" value={profile.activity} />
              <InfoRow
                label="Семейное положение:"
                value={
                  profile.relationship_status
                    ? (RELATIONSHIP_LABELS[profile.relationship_status] ?? null)
                    : null
                }
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <tr>
      <td className="pr-3 align-top whitespace-nowrap text-[#777]">{label}</td>
      <td className="text-[#333]">{value}</td>
    </tr>
  );
}
