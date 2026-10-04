"use client";

import { useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkSettingsDangerProps {
  account: VkAccount;
}

const CONFIRM = "УДАЛИТЬ";

export function VkSettingsDanger({ account }: VkSettingsDangerProps) {
  const [word, setWord] = useState("");
  const [asked, setAsked] = useState(false);

  return (
    <div className="pt-2 text-[11px]">
      <p className="text-[#333]">
        Будут удалены: страница, все записи, комментарии, отметки «мне
        нравится», фотографии, заявки в друзья и вся переписка. Восстановить это
        нельзя.
      </p>
      <p className="mt-2 text-[#777]">
        Учётная запись в системе входа останется: удалить её можно только со
        стороны сервера. Напишите на tamirlanzhamalov@gmail.com — удалю вручную.
      </p>

      {!asked ? (
        <VkButton tone="quiet" className="mt-3" onClick={() => setAsked(true)}>
          Удалить мои данные
        </VkButton>
      ) : (
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (word === CONFIRM) void account.purge();
          }}
        >
          <p className="mb-1 text-[#777]">
            Введите <span className="font-bold text-[#9b2c2c]">{CONFIRM}</span>,
            чтобы подтвердить.
          </p>
          <input
            value={word}
            onChange={(event) => setWord(event.target.value)}
            aria-label="Подтверждение удаления"
            className="w-[160px] border border-[#c0cad5] px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
          />
          <span className="ml-2 inline-flex gap-2">
            <VkButton type="submit" disabled={account.busy || word !== CONFIRM}>
              Удалить навсегда
            </VkButton>
            <VkButton
              tone="quiet"
              onClick={() => {
                setAsked(false);
                setWord("");
              }}
            >
              Отмена
            </VkButton>
          </span>
        </form>
      )}
    </div>
  );
}
