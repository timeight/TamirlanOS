"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VK_SECTION } from "@/core/vk/sections";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import {
  RELATIONSHIP_LABELS,
  fullName,
  type VkProfileRow,
} from "@/core/vk/vk-types";
import { useFriendState } from "@/hooks/use-friend-state";
import { useVkPhotos } from "@/hooks/use-vk-photos";

interface VkMobileProfileProps {
  profile: VkProfileRow;
  isMe: boolean;
  viewerId: string;
  onWrite: (profileId: string) => void;
  onSection: (section: string) => void;
}

const FACTS: readonly { key: keyof VkProfileRow; label: string }[] = [
  { key: "city", label: "Город" },
  { key: "birthday", label: "День рождения" },
  { key: "activity", label: "Деятельность" },
  { key: "website", label: "Веб-сайт" },
];

export function VkMobileProfile({
  profile,
  isMe,
  viewerId,
  onWrite,
  onSection,
}: VkMobileProfileProps) {
  const { state, friendCount, busy, act } = useFriendState(
    viewerId,
    profile.id,
  );
  const { photos } = useVkPhotos(profile.id);

  const facts = FACTS.filter((fact) => profile[fact.key]);

  return (
    <section>
      <div className="flex flex-col items-center border-b border-[#d8dde2] bg-[#f7f8fa] px-4 py-4">
        <VkAvatar size={96} src={profile.avatar_url} />
        <h2 className="mt-2.5 text-center text-[18px] leading-tight font-medium text-[#2a2a2a]">
          {fullName(profile)}
        </h2>
        {profile.city && (
          <p className="mt-0.5 text-[13px] text-[#7a7a7a]">{profile.city}</p>
        )}

        <div className="mt-3 flex w-full max-w-[280px] flex-col gap-2">
          {isMe ? (
            <VkMobileButton
              tone="secondary"
              onClick={() => onSection(VK_SECTION.settings)}
            >
              Редактировать
            </VkMobileButton>
          ) : (
            <>
              <VkMobileButton disabled={busy} onClick={() => void act()}>
                {FRIEND_ACTION[state]}
              </VkMobileButton>
              <VkMobileButton
                tone="secondary"
                onClick={() => onWrite(profile.id)}
              >
                Написать сообщение
              </VkMobileButton>
            </>
          )}
        </div>
      </div>

      <ul className="border-b border-[#d8dde2]">
        <VkMobileRow
          title="Друзья"
          meta={String(friendCount)}
          chevron
          onClick={() => onSection(VK_SECTION.friends)}
        />
        <VkMobileRow
          title="Фотографии"
          meta={String(photos.length)}
          chevron
          onClick={() => onSection(VK_SECTION.photos)}
        />
      </ul>

      {(facts.length > 0 || profile.relationship_status) && (
        <>
          <h3 className="bg-[#f2f4f6] px-3 py-1.5 text-[12px] text-[#7a7a7a] uppercase">
            Информация
          </h3>
          <dl className="border-b border-[#d8dde2]">
            {facts.map((fact) => (
              <div
                key={fact.key}
                className="flex gap-3 border-b border-[#e3e7ea] px-3 py-2 last:border-b-0"
              >
                <dt className="w-[110px] shrink-0 text-[13px] text-[#7a7a7a]">
                  {fact.label}
                </dt>
                <dd className="min-w-0 flex-1 text-[14px] break-words text-[#2a2a2a]">
                  {profile[fact.key] as string}
                </dd>
              </div>
            ))}
            {profile.relationship_status && (
              <div className="flex gap-3 px-3 py-2">
                <dt className="w-[110px] shrink-0 text-[13px] text-[#7a7a7a]">
                  Положение
                </dt>
                <dd className="min-w-0 flex-1 text-[14px] text-[#2a2a2a]">
                  {RELATIONSHIP_LABELS[profile.relationship_status]}
                </dd>
              </div>
            )}
          </dl>
        </>
      )}
    </section>
  );
}
