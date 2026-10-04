"use client";

import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { NOTIFY_ROWS, PRIVACY_ROWS } from "@/core/vk/api/account";
import type { VkProfileRow } from "@/core/vk/vk-types";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkMobilePrivacyProps {
  me: VkProfileRow;
  account: VkAccount;
}

export function VkMobilePrivacy({ me, account }: VkMobilePrivacyProps) {
  return (
    <>
      <VkMobileGroupLabel>Приватность</VkMobileGroupLabel>
      <div className="px-[10px] py-2.5">
        {PRIVACY_ROWS.map((row) => (
          <label key={row.key} className="mb-2.5 block">
            <span className="block text-[12px] text-[#8a8a8a]">
              {row.label}
            </span>
            <select
              value={String(me[row.key as keyof VkProfileRow])}
              disabled={account.busy}
              onChange={(event) =>
                void account.setPrivacy({ [row.key]: event.target.value })
              }
              className="mt-1 h-[29px] w-full rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] text-[#333]"
            >
              {row.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <VkMobileGroupLabel>Оповещения</VkMobileGroupLabel>
      <ul>
        {NOTIFY_ROWS.map((row) => (
          <li
            key={row.key}
            className="relative flex min-h-[43px] items-center gap-3 px-[10px] after:absolute after:right-0 after:bottom-0 after:left-[10px] after:h-px after:bg-[#d5d9de] after:content-['']"
          >
            <span className="min-w-0 flex-1 text-[14px] text-[#333]">
              {row.label}
            </span>
            <input
              type="checkbox"
              aria-label={row.label}
              checked={Boolean(me[row.key as keyof VkProfileRow])}
              disabled={account.busy}
              onChange={(event) =>
                void account.setPrivacy({ [row.key]: event.target.checked })
              }
              className="h-[18px] w-[18px]"
            />
          </li>
        ))}
      </ul>

      <p className="px-[10px] py-3 text-[12px] leading-[17px] text-[#9aa4ad]">
        Настройки применяются на сервере: закрытые записи и фотографии не
        отдаются даже прямому запросу к базе.
      </p>
    </>
  );
}
