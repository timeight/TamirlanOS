"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VK_FRIENDS, VK_PROFILE } from "@/core/browser/vk/vk-data";

const ACTIONS: readonly string[] = [
  "Написать сообщение",
  "Добавить в друзья",
  "Подписаться на обновления",
];

export function VkProfileCard() {
  return (
    <div className="flex gap-4 pt-3">
      <div className="w-[200px] shrink-0">
        <div className="border border-[#dae1e8] p-1">
          <VkAvatar size={190} />
        </div>
        <ul className="mt-2">
          {ACTIONS.map((action) => (
            <li key={action}>
              <button
                type="button"
                className="text-[11px] text-[#2b587a] hover:underline"
              >
                {action}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-3 border-t border-[#dae1e8] pt-2 text-[11px] font-bold text-[#45688e]">
          Друзья{" "}
          <span className="font-normal text-[#999]">{VK_PROFILE.friends}</span>
        </p>
        <ul className="mt-1 grid grid-cols-3 gap-1">
          {VK_FRIENDS.map((friend) => (
            <li key={friend} className="text-center">
              <VkAvatar size={56} />
              <span className="mt-0.5 block text-[10px] text-[#2b587a] hover:underline">
                {friend}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] leading-tight font-bold text-[#2b587a]">
          {VK_PROFILE.name}
        </h1>
        <p className="mt-0.5 text-[11px] text-[#777]">{VK_PROFILE.status}</p>

        <p className="mt-3 mb-1 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
          Информация
        </p>
        <table className="text-[11px] leading-[18px]">
          <tbody>
            <InfoRow label="Город:" value={VK_PROFILE.city} link />
            <InfoRow label="День рождения:" value={VK_PROFILE.birthday} link />
            <InfoRow label="Веб-сайт:" value={VK_PROFILE.site} link />
            <InfoRow label="Деятельность:" value={VK_PROFILE.activity} />
          </tbody>
        </table>

        <p className="mt-3 mb-1 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
          Мои фотографии{" "}
          <span className="font-normal text-[#999]">{VK_PROFILE.photos}</span>
        </p>
        <ul className="flex gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <li key={index}>
              <VkAvatar size={74} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <tr>
      <td className="pr-3 align-top whitespace-nowrap text-[#777]">{label}</td>
      <td className={link ? "text-[#2b587a] hover:underline" : "text-[#333]"}>
        {value}
      </td>
    </tr>
  );
}
