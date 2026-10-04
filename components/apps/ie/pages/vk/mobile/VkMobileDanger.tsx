"use client";

import { useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import type { VkAccount } from "@/hooks/use-vk-account";

interface VkMobileDangerProps {
  account: VkAccount;
}

const CONFIRM = "УДАЛИТЬ";

export function VkMobileDanger({ account }: VkMobileDangerProps) {
  const [word, setWord] = useState("");
  const [asked, setAsked] = useState(false);

  return (
    <div className="px-[10px] py-3 text-[13px] leading-[18px]">
      <p className="text-[#333]">
        Будут удалены: страница, все записи, комментарии, отметки «мне
        нравится», фотографии, заявки в друзья и вся переписка. Восстановить это
        нельзя.
      </p>
      <p className="mt-2 text-[#8a8a8a]">
        Учётная запись в системе входа останется: удалить её можно только со
        стороны сервера. Напишите на tamirlanzhamalov@gmail.com — удалю вручную.
      </p>

      {!asked ? (
        <VkMobileButton
          tone="secondary"
          className="mt-3 w-full"
          onClick={() => setAsked(true)}
        >
          Удалить мои данные
        </VkMobileButton>
      ) : (
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (word === CONFIRM) void account.purge();
          }}
        >
          <p className="mb-1 text-[12px] text-[#8a8a8a]">
            Введите <span className="font-bold text-[#b63131]">{CONFIRM}</span>,
            чтобы подтвердить.
          </p>
          <input
            value={word}
            onChange={(event) => setWord(event.target.value)}
            aria-label="Подтверждение удаления"
            className="mb-2 h-[29px] w-full rounded-[3px] border border-[#c2cad3] px-[7px] text-[13px] outline-none focus:border-[#5181b8]"
          />
          <div className="flex gap-1.5">
            <VkMobileButton
              type="submit"
              className="flex-1"
              disabled={account.busy || word !== CONFIRM}
            >
              Удалить навсегда
            </VkMobileButton>
            <VkMobileButton
              tone="secondary"
              onClick={() => {
                setAsked(false);
                setWord("");
              }}
            >
              Отмена
            </VkMobileButton>
          </div>
        </form>
      )}
    </div>
  );
}
