"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import { fullName } from "@/core/vk/vk-types";
import { useFriendState } from "@/hooks/use-friend-state";

interface VkFriendLinkProps {
  viewerId: string;
  targetId: string;
  onWrite: (profileId: string) => void;
  onOpenProfile: (profileId: string) => void;
}

/** Кнопка дружбы и общие друзья: состояние приходит из базы, не с клиента. */
export function VkFriendLink({
  viewerId,
  targetId,
  onWrite,
  onOpenProfile,
}: VkFriendLinkProps) {
  const { state, friendCount, mutual, busy, act } = useFriendState(
    viewerId,
    targetId,
  );
  const self = viewerId === targetId;

  return (
    <div className="mt-2 text-[11px]">
      {!self && (
        <div className="flex flex-wrap items-center gap-2">
          <VkButton disabled={busy} onClick={() => void act()}>
            {FRIEND_ACTION[state]}
          </VkButton>
          <VkButton onClick={() => onWrite(targetId)}>
            Отправить сообщение
          </VkButton>
          {state === "incoming_pending" && (
            <span className="text-[#777]">отправил Вам заявку</span>
          )}
        </div>
      )}

      <p className="mt-2 text-[#777]">
        Друзей: <span className="text-[#333]">{friendCount}</span>
        {mutual.length > 0 && (
          <>
            {" · общие: "}
            {mutual.slice(0, 5).map((profile, index) => (
              <span key={profile.id}>
                {index > 0 && ", "}
                <button
                  type="button"
                  onClick={() => onOpenProfile(profile.id)}
                  className="text-[#2b587a] hover:underline"
                >
                  {fullName(profile)}
                </button>
              </span>
            ))}
            {mutual.length > 5 && ` и ещё ${mutual.length - 5}`}
          </>
        )}
      </p>
    </div>
  );
}
