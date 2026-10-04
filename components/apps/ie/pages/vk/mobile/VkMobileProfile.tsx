"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
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
      <div className="flex border-b border-[#d5d9de] bg-[linear-gradient(#fbfcfd,#f1f4f6)] p-[10px]">
        <VkAvatar size={76} src={profile.avatar_url} />
        <div className="ml-2.5 min-w-0 flex-1">
          <h2 className="text-[16px] leading-[19px] font-bold break-words text-[#2a2a2a]">
            {fullName(profile)}
          </h2>
          <p className="mt-0.5 truncate text-[12px] text-[#8a8a8a]">
            {profile.city ?? `vk.com/${profile.username}`}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
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
                  Написать
                </VkMobileButton>
              </>
            )}
          </div>
        </div>
      </div>

      <ul>
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
          <VkMobileGroupLabel>Информация</VkMobileGroupLabel>
          <dl>
            {facts.map((fact) => (
              <div
                key={fact.key}
                className="relative flex min-h-[40px] items-center gap-3 px-[10px] py-1.5 after:absolute after:right-0 after:bottom-0 after:left-[10px] after:h-px after:bg-[#d5d9de] after:content-['']"
              >
                <dt className="shrink-0 text-[13px] text-[#8a8a8a]">
                  {fact.label}
                </dt>
                <dd className="ml-auto min-w-0 text-right text-[13px] break-words text-[#333]">
                  {profile[fact.key] as string}
                </dd>
              </div>
            ))}
            {profile.relationship_status && (
              <div className="relative flex min-h-[40px] items-center gap-3 px-[10px] py-1.5 after:absolute after:right-0 after:bottom-0 after:left-[10px] after:h-px after:bg-[#d5d9de] after:content-['']">
                <dt className="shrink-0 text-[13px] text-[#8a8a8a]">
                  Семейное положение
                </dt>
                <dd className="ml-auto text-right text-[13px] text-[#333]">
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
