"use client";

import { NOTIFY_ROWS, PRIVACY_ROWS } from "@/core/vk/api/account";
import type { VkProfileRow } from "@/core/vk/vk-types";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkSettingsPrivacyProps {
  me: VkProfileRow;
  account: VkAccount;
}

/** Каждый выбор уходит в базу сразу: кнопки «Сохранить» в VK здесь не было. */
export function VkSettingsPrivacy({ me, account }: VkSettingsPrivacyProps) {
  return (
    <div className="pt-2 text-[11px]">
      {PRIVACY_ROWS.map((row) => (
        <label key={row.key} className="mb-2 flex items-start gap-3">
          <span className="w-[230px] shrink-0 pt-[3px] text-right text-[#777]">
            {row.label}
          </span>
          <select
            value={String(me[row.key as keyof VkProfileRow])}
            disabled={account.busy}
            onChange={(event) =>
              void account.setPrivacy({ [row.key]: event.target.value })
            }
            className="border border-[#c0cad5] bg-white px-1 py-[2px] text-[11px]"
          >
            {row.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      <p className="mt-4 mb-1 border-b border-[#dae1e8] pb-1 font-bold text-[#45688e]">
        Оповещения
      </p>
      {NOTIFY_ROWS.map((row) => (
        <label key={row.key} className="mb-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(me[row.key as keyof VkProfileRow])}
            disabled={account.busy}
            onChange={(event) =>
              void account.setPrivacy({ [row.key]: event.target.checked })
            }
          />
          <span className="text-[#333]">{row.label}</span>
        </label>
      ))}

      <p className="mt-3 text-[10px] leading-[15px] text-[#939393]">
        Настройки применяются на сервере, а не в браузере: закрытые записи и
        фотографии не отдаются даже прямому запросу к базе.
      </p>
    </div>
  );
}
